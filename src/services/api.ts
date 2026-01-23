const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount: number;
  status?: 'pending' | 'accepted';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image';
  isRevoked?: boolean;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}

class ApiService {
  private getHeaders(userId?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (userId) {
      headers['user-id'] = userId;
    }
    return headers;
  }

  private async parseJson(response: Response) {
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();

    if (!response.ok) {
      // 网络错误或服务器错误
      if (!response.status || response.status === 0) {
        throw new Error('无法连接到服务器，请检查网络连接或服务器是否已启动');
      }
      throw new Error(`服务器错误 (${response.status})，请稍后重试`);
    }

    if (!contentType.includes('application/json')) {
      // 很可能是服务器未启动、路径错误，或返回了 HTML 错误页
      throw new Error('服务器连接失败，请检查后端服务是否已启动');
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error('服务器响应格式错误，请稍后重试');
    }
  }

  async register(email: string, password: string, name: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password, name }),
      });
      return this.parseJson(response);
    } catch (error: any) {
      if (error.message.includes('fetch')) {
        throw new Error('无法连接到服务器，请检查后端服务是否已启动');
      }
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return this.parseJson(response);
    } catch (error: any) {
      if (error.message.includes('fetch')) {
        throw new Error('无法连接到服务器，请检查后端服务是否已启动');
      }
      throw error;
    }
  }

  async searchUsers(query: string, userId: string) {
    const response = await fetch(`${API_BASE_URL}/api/users/search?q=${encodeURIComponent(query)}`, {
      headers: this.getHeaders(userId),
    });
    return this.parseJson(response);
  }

  async getFriends(userId: string): Promise<{ friends: Friend[] }> {
    const response = await fetch(`${API_BASE_URL}/api/friends`, {
      headers: this.getHeaders(userId),
    });
    return this.parseJson(response);
  }

  async sendFriendRequest(fromUserId: string, toUserId: string) {
    const response = await fetch(`${API_BASE_URL}/api/friends/request`, {
      method: 'POST',
      headers: this.getHeaders(fromUserId),
      body: JSON.stringify({ toUserId }),
    });
    return this.parseJson(response);
  }

  async approveFriendRequest(userId: string, requestId: string) {
    const response = await fetch(`${API_BASE_URL}/api/friends/approve`, {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: JSON.stringify({ requestId }),
    });
    return this.parseJson(response);
  }

  async getIncomingRequests(userId: string): Promise<{ requests: FriendRequest[] }> {
    const response = await fetch(`${API_BASE_URL}/api/friends/requests/incoming`, {
      headers: this.getHeaders(userId),
    });
    return this.parseJson(response);
  }

  async getMessages(userId: string, friendId: string): Promise<{ messages: Message[] }> {
    const response = await fetch(`${API_BASE_URL}/api/messages/${friendId}`, {
      headers: this.getHeaders(userId),
    });
    return this.parseJson(response);
  }

  async getUserById(userId: string, currentUserId: string): Promise<{ user?: User; error?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      headers: this.getHeaders(currentUserId),
    });
    return this.parseJson(response);
  }
}

export const apiService = new ApiService();

