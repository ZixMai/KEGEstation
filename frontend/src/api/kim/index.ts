import {useMutation, useQuery} from "@tanstack/react-query";
import apiClient from "@/lib/axios";

export type GetKimRequest = {
    kimId: number;
    name: string;
    firstName: string;
    contacts: {
        phone: string;
        email: string;
        fio: string;
    }
}

export type GetAllKimsUnit = {
    id: number;
    creatorId: number;
    creator: string;
    description: string;
    createdAt: string;
}

export type GetAllKimsResponse = {
    kims: GetAllKimsUnit[];
}

export type CreateResult = {
    kimId: number;
    userId: number;
    result: number;
    metaData: {
        answers: string
    }
}

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
}

export type KimTask = {
    id: number;
    description: string;
    fileS3Keys: string[];
    number: number;
    answer: string[];
    answerColumnsSize: number;
    answerRowsName: string;
    score: number;
    userAnswer: string;
}

export type GetKimResponse = {
    id: number;
    createId: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    unlockCode: string;
    tasksForKim: KimTask[];
    user: User;
    base64_images: string[]
}

export function useGetKim(getKimRequest: GetKimRequest) {
    return useQuery({
        queryFn: async () => await apiClient.post<GetKimResponse>("kim/get",getKimRequest),
        queryKey: [`${process.env.NEXT_PUBLIC_API_URL}/kim/get/${getKimRequest.kimId}`],
    })
}

export function useGetAllKims() {
    return useQuery({
        queryFn: async () => (await apiClient.post<GetAllKimsResponse>("kim/getAll")).data,
        queryKey: [`${process.env.NEXT_PUBLIC_API_URL}/kim/getAll`],
    })
}

export function useCreateResult(result: CreateResult) {
    return useMutation({
        mutationFn: async () => await apiClient.post("kim/createResult", result),
        mutationKey: ["kimId", result.kimId, result.userId],
    })
}