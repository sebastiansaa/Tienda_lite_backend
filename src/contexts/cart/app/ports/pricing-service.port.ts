//def el contrato para el servicio de precios   
export interface PricingServicePort {
    getPrice(productId: number): Promise<number | null>;
}

export default PricingServicePort;
