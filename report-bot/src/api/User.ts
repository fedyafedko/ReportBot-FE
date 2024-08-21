import ApiResponse from "./models/response/ApiResponse";
import Api from "./repository/Api";
import UserResponse from "./models/response/UserResponse";
import UserStatisticResponse from "./models/response/UserStatisticResponse";

const User = {
    getAll: async (projectName: string): Promise<ApiResponse<UserStatisticResponse[]>> => {
        const response = await Api.get<UserStatisticResponse[]>(`/user?projectName=${projectName}`);

        return response;
    }
};

export default User;