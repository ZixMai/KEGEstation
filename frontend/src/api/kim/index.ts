import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

export type GetKimRequest = {
  kimId: number;
  name: string;
  lastName: string;
  patronymic: string;
  school: string;
  schoolClassName: string;
  locality: string;
};

export type GetAllKimsUnit = {
  id: number;
  creatorId: number;
  creator: string;
  name: string;
  description: string;
  createdAt: string;
};

export type GetAllKimsResponse = {
  kims: GetAllKimsUnit[];
};

export type CreateResult = {
  kimId: number;
  userId: number;
  result: number;
  metaData: {
    answers: string;
  };
};

export type User = {
  id: number;
  login?: string;
  userFirstName: string;
  userName: string;
  contacts: {
    phone: string;
    email: string;
    fio: string;
  };
  role: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type s3 = {
  url: string;
  name: string;
};

export type KimTask = {
  id: number;
  text: string;
  fileS3Keys: s3[];
  number: number;
  key: string;
  table?: {
    rows: number;
    columns: number;
  };
  score: number;
  answer: string;
};

export type GetKimResponse = {
  id: number;
  creatorId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  unlockCode: string;
  tasksForKim: KimTask[];
  userId: number;
  base64_images: string[];
  realMode: boolean;
};

export function useGetKim(getKimRequest: GetKimRequest) {
  return useQuery({
    queryFn: async () =>
      await apiClient.post<GetKimResponse>("kim/get", getKimRequest),
    queryKey: [
      `${process.env.NEXT_PUBLIC_API_URL}/kim/get/${getKimRequest.kimId}`,
    ],
  });
}

export function useGetAllKims() {
  return useQuery({
    queryFn: async () =>
      (await apiClient.get<GetAllKimsResponse>("kim/getAll")).data,
    queryKey: [`${process.env.NEXT_PUBLIC_API_URL}/kim/getAll`],
  });
}

export function useCreateResult(result: CreateResult) {
  return useMutation({
    mutationFn: async () => await apiClient.post("kim/createResult", result),
    mutationKey: ["kimId", result.kimId, result.userId],
  });
}

export type CreateTaskResponse = {
  taskId: number;
};

export type GetAllTasksItem = {
  id: number;
  creatorId: number;
  number: number | null;
  key: string;
  table: { rows: number; columns: number } | null;
  text: string;
  editorJson: string;
  fileS3Keys: s3[];
};

export function useCreateTask() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post<CreateTaskResponse>(
        "tasks/createTask",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    },
  });
}

export function useGetAllTasks() {
  return useQuery({
    queryFn: async () =>
      (await apiClient.get<GetAllTasksItem[]>("tasks/getAllTasks")).data,
    queryKey: ["tasks/getAllTasks"],
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      await apiClient.put("tasks/updateTask", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  });
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: async (taskId: number) => {
      await apiClient.delete("tasks/deleteTask", { data: { taskId } });
    },
  });
}

export function useCreateKim() {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      unlockCode: string;
      realMode: boolean;
      tasks: number[];
    }) => {
      await apiClient.post("kim/create", data);
    },
  });
}
