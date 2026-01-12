import Stripe from 'stripe';

export class StripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
            apiVersion: '2024-12-18.acacia' as any // Locking version or use latest
        });
    }

    async createCustomer(email: string, name: string, metadata: Record<string, string>): Promise<string | null> {
        try {
            const customer = await this.stripe.customers.create({
                email,
                name,
                metadata
            });
            return customer.id;
        } catch (error) {
            console.error("Stripe Customer Creation Failed:", error);
            return null; // Fail gracefully as per legacy code?
        }
    }
}
