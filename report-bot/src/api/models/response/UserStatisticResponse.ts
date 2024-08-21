import UserResponse from "./UserResponse";

interface UserStatisticResponse {
    user: UserResponse;
    timePerDay: number;
    timePerWeek: number;
};

export default UserStatisticResponse;