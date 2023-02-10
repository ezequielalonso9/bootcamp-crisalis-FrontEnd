type AuthContextProps = {
    token: string,
    setToken: React.Dispatch<React.SetStateAction<string>>
}

type Person = {
    nombre: string,
    apellido: string,
    dni: number
}

type Customer = {
    estado: boolean,
    empresa: Empresa | null,
    persona: Person
}

type Persona = {
    nombre: string,
    apellido: string,
    dni: number
}

type Empresa = {
    razonSocial: string,
    cuit: number,
    fechaInicioActividad: string
}

type Cliente = {
    persona: Persona,
    empresa: Empresa | null,
    estado: boolean
}

type Impuesto = {
    id: number,
    nombreImpuesto: string,
    valorImpuesto: number,
    valorAdicional: number
}

type Prestacion = {
    "id": number,
    "nombre": costo,
    "costo": number,
    "detalle": string | null,
    "tipoPrestacion": string,
    "estado": boolean,
    "impuestosId": number[]
}

type Linea = {
    id: number,
    idPrestacion: number,
    nombrePrestacion: string,
    tipoPrestacion: 'Servicio' | 'Producto',
    cantidadPrestacion: number,
    costoUnitarioPrestacion: number,
    costoUnitarioGarantia: number,
    costoUnitarioSoporte: number,
    costoAdicionalGarantia: number,
    cargoAdicionalSoporte: number,
    añosGarantia: number | null
    fecha: Date | null,
    fechaUltimaModificacion: Date | null,
    descuento: number,
    costoTotalLinea: number,
    impuestos: Impuesto[]

}

type Pedido = {
    id: number,
    tipoCliente: "Persona" | "Empresa",
    estado: null | boolean,
    fechaPedido: Date | null,
    fechaUltimaModificacion: Date | null,
    linea: Linea,
    lineas: Linea[],
    subTotalPedido: number,
    totalImpuestoIva: number,
    totalImpuestoIbb: number,
    totalOtrosImpuestos: null,
    descuentoTotal: number,
    totalPedido: number
    cliente: Cliente
}



