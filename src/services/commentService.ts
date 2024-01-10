import { useMutation, useQuery } from "react-query";
import { CommentsProps } from "../components/Landing/modules/LandingComments/LandingComments";
import { BASE_URL } from "./recipesService";
import { useCallback } from "react";
import { BaseCommentData } from "./types";
import { useRequestHandler } from "../hooks/useRequestHandler";

/**
 * hook to handle all comment related requests
 * @returns handler functions
 */
export const useCommentService = () => {
    const { GET, authDELETE, authPUT, authPOST } = useRequestHandler();

    const getRecipeComments = (recipeName: string) => {
        const {
            data: comments,
            error: commentsFetchError,
            isFetching: commentsAreLoading
        } = useQuery(['recipeComments', recipeName.toLowerCase()], () => {
            const response: Promise<CommentsProps[]> = GET(`${BASE_URL}/comments/${recipeName.toLowerCase()}`);
            return response;
        });

        return {
            comments,
            commentsFetchError,
            commentsAreLoading
        }
    }

    const useDeleteComment = () => {
        const {
            mutateAsync: deleteCommentMutation,
            isLoading,
            isError
        } = useMutation(({ commentId }: { commentId: number }) => {
            const response: Promise<{ status: string }> = authDELETE(`${BASE_URL}/comments`, { id: commentId });
            return response;
        }, { retry: 3 });

        const deleteComment = useCallback(async (commentId: number) => {
            try {
                const deleteCommentResponse = deleteCommentMutation({ commentId });
                return { deleteCommentResponse };
            } catch (error) {
                return { error };
            }
        }, [deleteCommentMutation]);

        return { deleteComment, isLoading, isError };
    };

    const useEditComment = () => {
        const {
            mutateAsync: editCommentMutation,
            isLoading,
            isError
        } = useMutation(({ id, content }: { id: number, content: string }) => {
            const response: Promise<CommentsProps> = authPUT(`${BASE_URL}/comments`, { id, content });
            return response;
        }, { retry: 3 });

        const editComment = useCallback(async (id: number, content: string) => {
            try {
                const editCommentResponse = editCommentMutation({ id, content });
                return { editCommentResponse };
            } catch (error) {
                return { error };
            }
        }, [editCommentMutation]);

        return { editComment, isLoading, isError };
    };

    const useCreateComment = () => {
        const {
            mutateAsync: createCommentMutation,
            isLoading,
            isError
        } = useMutation((data: BaseCommentData) => {
            const response: Promise<CommentsProps> = authPOST(`${BASE_URL}/comments`, data);
            return response;
        }, { retry: 1 });

        const createComment = useCallback(async (data: BaseCommentData) => {
            const createCommentResponse = createCommentMutation(data);
            return { createCommentResponse };
        }, [createCommentMutation]);

        return { createComment, isLoading, isError };
    };

    return {
        getRecipeComments,
        useDeleteComment,
        useEditComment,
        useCreateComment,
    }
}