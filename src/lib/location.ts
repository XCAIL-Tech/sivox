// Ubicación geográfica para SIVOX
// Argentina: API pública georef.ar (4 niveles)
// Otros países: listas estáticas (3 niveles, ciudad libre)

const GEOREF = "https://apis.datos.gob.ar/georef/api";

export interface Province   { id: string; nombre: string; }
export interface Municipality { id: string; nombre: string; provincia: { id: string; nombre: string }; }
export interface Country    { code: string; name: string; hispanic?: boolean; }

// ─── Países ───────────────────────────────────────────────────────────────────

export const ALL_COUNTRIES: Country[] = [
  { code: "AR", name: "Argentina",            hispanic: true },
  { code: "BO", name: "Bolivia",              hispanic: true },
  { code: "CL", name: "Chile",               hispanic: true },
  { code: "CO", name: "Colombia",            hispanic: true },
  { code: "CR", name: "Costa Rica",          hispanic: true },
  { code: "CU", name: "Cuba",               hispanic: true },
  { code: "DO", name: "República Dominicana", hispanic: true },
  { code: "EC", name: "Ecuador",             hispanic: true },
  { code: "ES", name: "España",              hispanic: true },
  { code: "GQ", name: "Guinea Ecuatorial",   hispanic: true },
  { code: "GT", name: "Guatemala",           hispanic: true },
  { code: "HN", name: "Honduras",            hispanic: true },
  { code: "MX", name: "México",             hispanic: true },
  { code: "NI", name: "Nicaragua",           hispanic: true },
  { code: "PA", name: "Panamá",             hispanic: true },
  { code: "PE", name: "Perú",              hispanic: true },
  { code: "PR", name: "Puerto Rico",         hispanic: true },
  { code: "PY", name: "Paraguay",            hispanic: true },
  { code: "SV", name: "El Salvador",         hispanic: true },
  { code: "UY", name: "Uruguay",             hispanic: true },
  { code: "VE", name: "Venezuela",           hispanic: true },
  { code: "BR", name: "Brasil" },
  { code: "US", name: "Estados Unidos" },
  { code: "FR", name: "Francia" },
  { code: "IT", name: "Italia" },
  { code: "DE", name: "Alemania" },
  { code: "PT", name: "Portugal" },
];

// ─── Labels de niveles administrativos ────────────────────────────────────────

export const ADMIN_LEVEL_1_LABELS: Record<string, string> = {
  AR: "Provincia", ES: "Provincia / Comunidad", MX: "Estado",
  CL: "Región", UY: "Departamento", PY: "Departamento",
  BO: "Departamento", CO: "Departamento", EC: "Provincia",
  PE: "Departamento / Región", VE: "Estado", CR: "Provincia",
  GT: "Departamento", HN: "Departamento", SV: "Departamento",
  NI: "Departamento", PA: "Provincia", DO: "Provincia",
  PR: "Municipio", CU: "Provincia", GQ: "Provincia",
  BR: "Estado", US: "Estado",
};

export const ADMIN_LEVEL_2_LABELS: Record<string, string> = {
  AR: "Municipio / Partido", MX: "Ciudad / Municipio", ES: "Ciudad / Municipio",
  CL: "Ciudad / Comuna", CO: "Ciudad / Municipio", PE: "Ciudad / Distrito",
  VE: "Ciudad / Municipio", EC: "Ciudad / Cantón", BO: "Ciudad / Municipio",
  PY: "Ciudad / Distrito", UY: "Ciudad / Municipio", CR: "Ciudad / Cantón",
  CU: "Ciudad / Municipio", DO: "Ciudad / Municipio", GT: "Ciudad / Municipio",
  HN: "Ciudad / Municipio", SV: "Ciudad / Municipio", NI: "Ciudad / Municipio",
  PA: "Ciudad / Distrito", PR: "Barrio / Sector", BR: "Ciudad",
  US: "Ciudad / Condado",
};

export const ADMIN_LEVEL_3_LABELS: Record<string, string> = {
  AR: "Localidad / Barrio",
};

// ─── Provincias / estados por país (lista estática para no-AR) ────────────────

export const PROVINCES_BY_COUNTRY: Record<string, string[]> = {
  MX: ["Aguascalientes","Baja California","Baja California Sur","Campeche","Chiapas","Chihuahua","Ciudad de México","Coahuila","Colima","Durango","Guanajuato","Guerrero","Hidalgo","Jalisco","México","Michoacán","Morelos","Nayarit","Nuevo León","Oaxaca","Puebla","Querétaro","Quintana Roo","San Luis Potosí","Sinaloa","Sonora","Tabasco","Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas"],
  ES: ["Andalucía","Aragón","Asturias","Baleares","Canarias","Cantabria","Castilla-La Mancha","Castilla y León","Cataluña","Comunidad Valenciana","Extremadura","Galicia","La Rioja","Madrid","Murcia","Navarra","País Vasco"],
  CL: ["Arica y Parinacota","Tarapacá","Antofagasta","Atacama","Coquimbo","Valparaíso","Metropolitana de Santiago","O'Higgins","Maule","Ñuble","Biobío","Araucanía","Los Ríos","Los Lagos","Aysén","Magallanes"],
  CO: ["Amazonas","Antioquia","Arauca","Atlántico","Bogotá","Bolívar","Boyacá","Caldas","Caquetá","Casanare","Cauca","Cesar","Chocó","Córdoba","Cundinamarca","Guainía","Guaviare","Huila","La Guajira","Magdalena","Meta","Nariño","Norte de Santander","Putumayo","Quindío","Risaralda","San Andrés y Providencia","Santander","Sucre","Tolima","Valle del Cauca","Vaupés","Vichada"],
  UY: ["Artigas","Canelones","Cerro Largo","Colonia","Durazno","Flores","Florida","Lavalleja","Maldonado","Montevideo","Paysandú","Río Negro","Rivera","Rocha","Salto","San José","Soriano","Tacuarembó","Treinta y Tres"],
  PY: ["Alto Paraguay","Alto Paraná","Amambay","Asunción","Boquerón","Caaguazú","Caazapá","Canindeyú","Central","Concepción","Cordillera","Guairá","Itapúa","Misiones","Ñeembucú","Paraguarí","Presidente Hayes","San Pedro"],
  BO: ["Chuquisaca","Cochabamba","Beni","La Paz","Oruro","Pando","Potosí","Santa Cruz","Tarija"],
  EC: ["Azuay","Bolívar","Cañar","Carchi","Chimborazo","Cotopaxi","El Oro","Esmeraldas","Galápagos","Guayas","Imbabura","Loja","Los Ríos","Manabí","Morona Santiago","Napo","Orellana","Pastaza","Pichincha","Santa Elena","Santo Domingo","Sucumbíos","Tungurahua","Zamora Chinchipe"],
  PE: ["Amazonas","Áncash","Apurímac","Arequipa","Ayacucho","Cajamarca","Callao","Cusco","Huancavelica","Huánuco","Ica","Junín","La Libertad","Lambayeque","Lima","Loreto","Madre de Dios","Moquegua","Pasco","Piura","Puno","San Martín","Tacna","Tumbes","Ucayali"],
  VE: ["Amazonas","Anzoátegui","Apure","Aragua","Barinas","Bolívar","Carabobo","Cojedes","Delta Amacuro","Distrito Capital","Falcón","Guárico","Lara","Mérida","Miranda","Monagas","Nueva Esparta","Portuguesa","Sucre","Táchira","Trujillo","Vargas","Yaracuy","Zulia"],
  CR: ["Alajuela","Cartago","Guanacaste","Heredia","Limón","Puntarenas","San José"],
  GT: ["Alta Verapaz","Baja Verapaz","Chimaltenango","Chiquimula","El Progreso","Escuintla","Guatemala","Huehuetenango","Izabal","Jalapa","Jutiapa","Petén","Quetzaltenango","Quiché","Retalhuleu","Sacatepéquez","San Marcos","Santa Rosa","Sololá","Suchitepéquez","Totonicapán","Zacapa"],
  HN: ["Atlántida","Choluteca","Colón","Comayagua","Copán","Cortés","El Paraíso","Francisco Morazán","Gracias a Dios","Intibucá","Islas de la Bahía","La Paz","Lempira","Ocotepeque","Olancho","Santa Bárbara","Valle","Yoro"],
  SV: ["Ahuachapán","Cabañas","Chalatenango","Cuscatlán","La Libertad","La Paz","La Unión","Morazán","San Miguel","San Salvador","San Vicente","Santa Ana","Sonsonate","Usulután"],
  NI: ["Boaco","Carazo","Chinandega","Chontales","Estelí","Granada","Jinotega","León","Madriz","Managua","Masaya","Matagalpa","Nueva Segovia","Región Autónoma Costa Caribe Norte","Región Autónoma Costa Caribe Sur","Rivas","Río San Juan"],
  PA: ["Bocas del Toro","Chiriquí","Coclé","Colón","Darién","Emberá-Wounaan","Guna Yala","Herrera","Los Santos","Ngäbe-Buglé","Panamá","Panamá Oeste","Veraguas"],
  DO: ["Azua","Bahoruco","Barahona","Dajabón","Distrito Nacional","Duarte","El Seibo","Elías Piña","Espaillat","Hato Mayor","Hermanas Mirabal","Independencia","La Altagracia","La Romana","La Vega","María Trinidad Sánchez","Monseñor Nouel","Monte Cristi","Monte Plata","Pedernales","Peravia","Puerto Plata","Samaná","San Cristóbal","San José de Ocoa","San Juan","San Pedro de Macorís","Sánchez Ramírez","Santiago","Santiago Rodríguez","Santo Domingo","Valverde"],
  CU: ["Artemisa","Camagüey","Ciego de Ávila","Cienfuegos","Granma","Guantánamo","Holguín","Isla de la Juventud","La Habana","Las Tunas","Matanzas","Mayabeque","Pinar del Río","Sancti Spíritus","Santiago de Cuba","Villa Clara"],
  GQ: ["Annobón","Bioko Norte","Bioko Sur","Centro Sur","Kié-Ntem","Litoral","Wele-Nzas"],
  BR: ["Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Distrito Federal","Espírito Santo","Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul","Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí","Rio de Janeiro","Rio Grande do Norte","Rio Grande do Sul","Rondônia","Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins"],
  US: ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],
};

// ─── Códigos ISO 3166-2 de provincias para Argentina ──────────────────────────

export const AR_INDEC_TO_ISO: Record<string, string> = {
  "02": "AR-C", "06": "AR-B", "10": "AR-K", "14": "AR-X", "18": "AR-W",
  "22": "AR-H", "26": "AR-U", "30": "AR-E", "34": "AR-P", "38": "AR-Y",
  "42": "AR-L", "46": "AR-F", "50": "AR-M", "54": "AR-N", "58": "AR-Q",
  "62": "AR-R", "66": "AR-A", "70": "AR-J", "74": "AR-D", "78": "AR-Z",
  "82": "AR-S", "86": "AR-G", "90": "AR-T", "94": "AR-V",
};

// ─── Funciones georef.ar (Argentina) ─────────────────────────────────────────

export async function getProvinces(): Promise<Province[]> {
  try {
    const res = await fetch(`${GEOREF}/provincias?max=24`);
    const data = await res.json();
    const provinces: Province[] = data.provincias ?? [];
    return provinces.sort((a, b) => {
      if (a.nombre.includes("Ciudad Autónoma")) return -1;
      if (b.nombre.includes("Ciudad Autónoma")) return 1;
      if (a.nombre === "Buenos Aires") return -1;
      if (b.nombre === "Buenos Aires") return 1;
      return a.nombre.localeCompare(b.nombre);
    });
  } catch {
    return [];
  }
}

export async function searchMunicipalities(
  query: string,
  provinceId?: string,
  max = 500,
): Promise<Municipality[]> {
  try {
    if (!query && !provinceId) return [];
    if (query && query.length < 2 && !provinceId) return [];
    let url = `${GEOREF}/municipios?max=${max}`;
    if (query) url += `&nombre=${encodeURIComponent(query)}`;
    if (provinceId) url += `&provincia=${provinceId}`;
    const res = await fetch(url);
    const data = await res.json();
    const results: Municipality[] = data.municipios ?? [];
    return results.sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

export async function searchLocalities(
  query: string,
  provinceId?: string,
  max = 500,
): Promise<Municipality[]> {
  try {
    if (!query && !provinceId) return [];
    if (query && query.length < 2 && !provinceId) return [];
    let url = `${GEOREF}/localidades?max=${max}`;
    if (query) url += `&nombre=${encodeURIComponent(query)}`;
    if (provinceId) url += `&provincia=${provinceId}`;
    const res = await fetch(url);
    const data = await res.json();
    const results: Municipality[] = data.localidades ?? [];
    return results.sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

export async function searchLocalitiesByMunicipality(
  query: string,
  provinceId: string,
  municipalityId: string,
  max = 500,
): Promise<Municipality[]> {
  try {
    let url = `${GEOREF}/localidades?provincia=${provinceId}&municipio=${municipalityId}&max=${max}`;
    if (query) url += `&nombre=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    const results: Municipality[] = data.localidades ?? [];
    return results.sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { numeric: true }));
  } catch {
    return [];
  }
}
