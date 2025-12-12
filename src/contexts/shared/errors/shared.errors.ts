// --- Title ---
export class InvalidTitleError extends Error {
    constructor(message: string = "El nombre no puede estar vacío") {
        super(message);
        this.name = "InvalidTitleError";
    }
}

//Image

export class InvalidImageUrlError extends Error {
    constructor(message: string = "La URL de la imagen debe ser válida y comenzar con http o https") {
        super(message);
        this.name = "InvalidImageUrlError";
    }
}

//Slug

export class InvalidSlugError extends Error {
    constructor(message: string = "El slug no es válido") {
        super(message);
        this.name = "InvalidSlugError";
    }
}
