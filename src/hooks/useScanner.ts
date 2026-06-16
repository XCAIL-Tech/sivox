import { useEffect, useRef, useCallback } from "react";
import { useSivoxStore } from "@/store/useSivoxStore";
import type { GridCell } from "@/types";

interface UseScannerProps {
  rows: GridCell[][];
  onCellSelect: (cell: GridCell) => void;
}

export function useScanner({ rows, onCellSelect }: UseScannerProps) {
  const { scanState, isScanning, settings, setScanState, setScanning } =
    useSivoxStore();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoPauseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetAutoPause = useCallback(() => {
    if (autoPauseRef.current) clearTimeout(autoPauseRef.current);
    if (settings.autoPauseAfter > 0) {
      autoPauseRef.current = setTimeout(() => {
        setScanning(false);
        setScanState({ level: "idle" });
      }, settings.autoPauseAfter * 1000);
    }
  }, [settings.autoPauseAfter, setScanState, setScanning]);

  const startRowScan = useCallback(() => {
    setScanState({ level: "row", activeRow: 0 });
  }, [setScanState]);

  const advanceRow = useCallback(() => {
    if (scanState.level !== "row") return;
    const nextRow = (scanState.activeRow + 1) % rows.length;
    setScanState({ level: "row", activeRow: nextRow });
  }, [scanState, rows.length, setScanState]);

  const advanceCell = useCallback(() => {
    if (scanState.level !== "cell") return;
    const rowLength = rows[scanState.activeRow]?.length ?? 0;
    const nextCell = (scanState.activeCell + 1) % rowLength;
    setScanState({
      level: "cell",
      activeRow: scanState.activeRow,
      activeCell: nextCell,
    });
  }, [scanState, rows, setScanState]);

  // Auto-advance timer
  useEffect(() => {
    if (!isScanning) {
      clearTimer();
      return;
    }

    if (scanState.level === "idle") {
      startRowScan();
      return;
    }

    if (scanState.level === "row") {
      timerRef.current = setTimeout(advanceRow, settings.rowSpeed);
    } else if (scanState.level === "cell") {
      timerRef.current = setTimeout(advanceCell, settings.cellSpeed);
    }

    return clearTimer;
  }, [
    isScanning,
    scanState,
    settings.rowSpeed,
    settings.cellSpeed,
    startRowScan,
    advanceRow,
    advanceCell,
    clearTimer,
  ]);

  const handleSelect = useCallback(() => {
    resetAutoPause();

    if (!isScanning) {
      setScanning(true);
      setScanState({ level: "row", activeRow: 0 });
      return;
    }

    if (scanState.level === "row") {
      clearTimer();
      // Pausa breve al entrar a la fila
      setTimeout(() => {
        setScanState({
          level: "cell",
          activeRow: scanState.activeRow,
          activeCell: 0,
        });
      }, settings.pauseOnEnterRow);
      return;
    }

    if (scanState.level === "cell") {
      clearTimer();
      const cell = rows[scanState.activeRow]?.[scanState.activeCell];
      if (cell) {
        onCellSelect(cell);
        if (navigator.vibrate) navigator.vibrate([30]);
      }
      // Vuelve al barrido de filas
      setScanState({ level: "row", activeRow: 0 });
    }
  }, [
    isScanning,
    scanState,
    rows,
    settings.pauseOnEnterRow,
    setScanState,
    setScanning,
    clearTimer,
    resetAutoPause,
    onCellSelect,
  ]);

  // Listeners globales de teclado
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleSelect]);

  return { handleSelect };
}
