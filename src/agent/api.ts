// Agent API Client
// Connects to service-agent backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8006';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

// Helper to get auth token from localStorage
const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
};

// Base fetch function with auth headers
async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                data: null as T,
                message: data.message || data.error || 'Request failed',
                error: data.error,
            };
        }

        // Handle different response formats from backend
        if (data.success !== undefined) {
            return data as ApiResponse<T>;
        }

        // If backend returns data directly without success wrapper
        return {
            success: true,
            data: data.data || data,
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            data: null as T,
            message: error instanceof Error ? error.message : 'Network error',
        };
    }
}

// Types for API responses
export interface DashboardStats {
    totalSalesThisMonth: number;
    totalOrdersThisMonth: number;
    pendingCommission: number;
    targetAmount: number;
    achievementPercent: number;
    salesTrend?: number;
    ordersTrend?: number;
}

export interface AgentOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    date: string;
    total: number;
    status: string;
    commission: number;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    createdAt: string;
}

export interface Commission {
    id: string;
    orderId: string;
    orderNumber: string;
    amount: number;
    rate: number;
    status: string;
    createdAt: string;
}

export interface PerformanceData {
    sales: number;
    orders: number;
    customers: number;
    growth: number;
    monthlySales?: { month: string; sales: number }[];
}

export interface TeamMember {
    rank: number;
    agentId: string;
    agentName: string;
    totalSales: number;
    isCurrentUser?: boolean;
}

export const agentApi = {
    // Get agent profile
    getProfile: async (): Promise<ApiResponse<any>> => {
        return apiFetch('/api/v1/agent/profile');
    },

    // Dashboard data
    getDashboard: async (): Promise<ApiResponse<any>> => {
        return apiFetch('/api/v1/agent/dashboard');
    },

    // Dashboard stats (legacy - uses dashboard endpoint)
    getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
        const response = await apiFetch<any>('/api/v1/agent/dashboard');
        if (!response.success) {
            return response as ApiResponse<DashboardStats>;
        }
        // Extract stats from dashboard response
        return {
            success: true,
            data: {
                totalSalesThisMonth: response.data?.total_sales || 0,
                totalOrdersThisMonth: response.data?.total_orders || 0,
                pendingCommission: response.data?.pending_commission || 0,
                targetAmount: response.data?.target_amount || 0,
                achievementPercent: response.data?.achievement_percent || 0,
                salesTrend: response.data?.sales_trend,
                ordersTrend: response.data?.orders_trend,
            },
        };
    },

    // Orders
    getOrders: async (filters?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<AgentOrder[]>> => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const queryString = params.toString();
        const endpoint = `/api/v1/agent/orders${queryString ? `?${queryString}` : ''}`;

        return apiFetch(endpoint);
    },

    getOrder: async (orderId: string): Promise<ApiResponse<AgentOrder>> => {
        return apiFetch(`/api/v1/agent/orders/${orderId}`);
    },

    createOrder: async (orderData: {
        customerId: string;
        items: Array<{
            productId: string;
            variantId?: string;
            quantity: number;
            price: number;
        }>;
        shippingAddress: {
            name: string;
            phone: string;
            address: string;
            city: string;
            state: string;
            postcode: string;
        };
        notes?: string;
    }): Promise<ApiResponse<AgentOrder>> => {
        return apiFetch('/api/v1/agent/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    // Customers
    getCustomers: async (filters?: {
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<Customer[]>> => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const queryString = params.toString();
        const endpoint = `/api/v1/agent/customers${queryString ? `?${queryString}` : ''}`;

        return apiFetch(endpoint);
    },

    getCustomer: async (customerId: string): Promise<ApiResponse<Customer>> => {
        return apiFetch(`/api/v1/agent/customers/${customerId}`);
    },

    createCustomer: async (customerData: {
        name: string;
        email: string;
        phone: string;
        address?: string;
        city?: string;
        state?: string;
        postcode?: string;
    }): Promise<ApiResponse<Customer>> => {
        return apiFetch('/api/v1/agent/customers', {
            method: 'POST',
            body: JSON.stringify(customerData),
        });
    },

    updateCustomer: async (
        customerId: string,
        customerData: Partial<{
            name: string;
            email: string;
            phone: string;
            address?: string;
            city?: string;
            state?: string;
            postcode?: string;
        }>
    ): Promise<ApiResponse<Customer>> => {
        return apiFetch(`/api/v1/agent/customers/${customerId}`, {
            method: 'PUT',
            body: JSON.stringify(customerData),
        });
    },

    // Commissions
    getCommissions: async (filters?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<{
        total: number;
        pending: number;
        paid: number;
        data: Commission[];
    }>> => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const queryString = params.toString();
        const endpoint = `/api/v1/agent/commissions${queryString ? `?${queryString}` : ''}`;

        return apiFetch(endpoint);
    },

    // Performance
    getPerformance: async (period?: string): Promise<ApiResponse<PerformanceData>> => {
        const params = new URLSearchParams();
        if (period) params.append('period', period);

        const queryString = params.toString();
        const endpoint = `/api/v1/agent/performance${queryString ? `?${queryString}` : ''}`;

        return apiFetch(endpoint);
    },

    // Team
    getTeam: async (): Promise<ApiResponse<TeamMember[]>> => {
        return apiFetch('/api/v1/agent/team');
    },

    // Combined dashboard data for frontend components
    getDashboardData: async (): Promise<ApiResponse<{
        stats: DashboardStats;
        recentOrders: AgentOrder[];
        monthlyPerformance: { month: string; sales: number }[];
        teamLeaderboard: TeamMember[];
    }>> => {
        try {
            // Fetch all dashboard data in parallel
            const [dashboardRes, ordersRes, performanceRes, teamRes] = await Promise.all([
                agentApi.getDashboard(),
                agentApi.getOrders({ limit: 5 }),
                agentApi.getPerformance('monthly'),
                agentApi.getTeam(),
            ]);

            // Map dashboard response to expected format
            const dashData = dashboardRes.data || {};

            return {
                success: true,
                data: {
                    stats: {
                        totalSalesThisMonth: dashData.total_sales || 0,
                        totalOrdersThisMonth: dashData.total_orders || 0,
                        pendingCommission: dashData.pending_commission || 0,
                        targetAmount: dashData.target_amount || 20000,
                        achievementPercent: dashData.achievement_percent || 0,
                        salesTrend: dashData.sales_trend || 0,
                        ordersTrend: dashData.orders_trend || 0,
                    },
                    recentOrders: ordersRes.success ? (ordersRes.data || []).slice(0, 5).map((order: any) => ({
                        id: order.id,
                        orderNumber: order.order_number || order.orderNumber,
                        customerName: order.customer_name || order.customerName,
                        date: order.created_at || order.date,
                        total: order.total || order.total_amount,
                        status: order.status,
                        commission: order.commission || 0,
                    })) : [],
                    monthlyPerformance: performanceRes.success ? (performanceRes.data?.monthlySales || []) : [],
                    teamLeaderboard: teamRes.success ? (teamRes.data || []).map((member: any, index: number) => ({
                        rank: index + 1,
                        agentId: member.id || member.agent_id,
                        agentName: member.name || member.agent_name,
                        totalSales: member.total_sales || 0,
                        isCurrentUser: member.is_current_user || false,
                    })) : [],
                },
            };
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            return {
                success: false,
                data: {
                    stats: {
                        totalSalesThisMonth: 0,
                        totalOrdersThisMonth: 0,
                        pendingCommission: 0,
                        targetAmount: 0,
                        achievementPercent: 0,
                    },
                    recentOrders: [],
                    monthlyPerformance: [],
                    teamLeaderboard: [],
                },
                message: 'Failed to fetch dashboard data',
            };
        }
    },

    // Search products from catalog service (via agent service proxy)
    searchProducts: async (query: string): Promise<ApiResponse<any[]>> => {
        const params = new URLSearchParams({ search: query });
        // This might need to call catalog service directly or through a proxy
        return apiFetch(`/api/v1/products?${params.toString()}`);
    },
};

export default agentApi;
