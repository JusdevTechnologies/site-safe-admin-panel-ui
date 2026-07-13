/**
 * Employee Service
 * Handles employee CRUD operations.
 */
import apiClient from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const extractData = (response) => response.data.data;

export const employeeService = {
  getEmployees: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES, { params });
    return { employees: response.data.data ?? [], meta: response.data.meta };
  },

  getEmployee: async (employeeId) => {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYEE(employeeId));
    return extractData(response);
  },

  createEmployee: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.EMPLOYEES, data);
    return extractData(response);
  },

  updateEmployee: async (employeeId, data) => {
    const response = await apiClient.patch(API_ENDPOINTS.EMPLOYEE(employeeId), data);
    return extractData(response);
  },

  deleteEmployee: async (employeeId) => {
    const response = await apiClient.delete(API_ENDPOINTS.EMPLOYEE(employeeId));
    return extractData(response);
  }
};

export default employeeService;
