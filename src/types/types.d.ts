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
    valorImpuesto: number
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



