import ApiResponse from "./models/response/ApiResponse";
import ReportResponse from "./models/response/ReportResponse";
import FilterRequest from "./models/request/FilterRequest";
import Api from "./repository/Api";

const Reports = {
    getAll: async (request: FilterRequest): Promise<ApiResponse<ReportResponse[]>> => {
        const response = await Api.get<ReportResponse[]>(`/report/get-reports?ProjectName=${request.projectName}&FromDate=${request.fromDate}&ToDate=${request.toDate}&UserName=${request.userName}`);

        return response;
    },
    getForProject: async (projectId: string, request: FilterRequest): Promise<ApiResponse<ReportResponse[]>> => {
        const response = await Api.get<ReportResponse[]>(`/report/${projectId}?FromDate=${request.fromDate}&ToDate=${request.toDate}&UserName=${request.userName}`);

        return response;
    },
    sentToChat: async (reportId: number): Promise<ApiResponse<boolean>> => {
        const response = await Api.get<boolean>(`/report/send-report-to-chat?reportId=${reportId}`);

        return response;
    }
};

export default Reports;
