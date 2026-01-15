export const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const createOrder = async (amount: number, planId: string) => {
    // In a real app, this would call your backend to create a Razorpay order
    // For now, we'll simulate the order creation
    return {
        id: `order_${Math.random().toString(36).substring(7)}`,
        amount: amount * 100, // Converting to paisa
        currency: 'INR',
        planId,
    };
};
