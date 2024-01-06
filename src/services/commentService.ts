import { useMutation, useQuery } from "react-query";
import { CommentsProps } from "../components/Landing/modules/LandingComments/LandingComments";
import { BASE_URL } from "./recipesService";
import { useCallback } from "react";
import { BaseCommentData } from "./types";

/**
 * Gets all comments for the given recipe
 * @param recipeName the name of the recipe
 */
export const getRecipeComments = (recipeName: string) => {
    const {
        data: comments,
        error: commentsFetchError,
        isFetching: commentsAreLoading
    } = useQuery(['recipeComments', recipeName.toLowerCase()], () => getCommentsRequest(recipeName.toLowerCase()));

    return {
        comments,
        commentsFetchError,
        commentsAreLoading
    }
}

const getCommentsRequest = async (recipeName: string): Promise<CommentsProps[]> => {
    const response = await fetch(`${BASE_URL}/comments/${recipeName}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${data}`);
    }
    return data;
}

/**
 * Used to delete a comment
 */
export const useDeleteComment = (token: string) => {
    const {
        mutateAsync: deleteCommentMutation,
        isLoading,
        isError
    } = useMutation(({ commentId }: { commentId: number }) => deleteCommentRequest(token, commentId), { retry: 3 });

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

const deleteCommentRequest = async (token: string, commentId: number): Promise<{ status: string }> => {
    const response = await fetch(`${BASE_URL}/comments`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token,
        },
        body: JSON.stringify({ id: commentId })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${JSON.stringify(data)}`);
    }
    return data;
}

/**
 * Used to edit a comment
 */
export const useEditComment = (token: string) => {
    const {
        mutateAsync: editCommentMutation,
        isLoading,
        isError
    } = useMutation(({ id, content }: { id: number, content: string }) => editCommentRequest(token, id, content), { retry: 3 });

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

const editCommentRequest = async (token: string, id: number, content: string): Promise<CommentsProps> => {
    const response = await fetch(`${BASE_URL}/comments`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token,
        },
        body: JSON.stringify({ id, content })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${JSON.stringify(data)}`);
    }
    return data;
}

/**
 * Used to create a comment
 */
export const useCreateComment = (token: string) => {
    const {
        mutateAsync: createCommentMutation,
        isLoading,
        isError
    } = useMutation((data: BaseCommentData) => createCommentRequest(token, data), { retry: 1 });

    const createComment = useCallback(async (data: BaseCommentData) => {
        const createCommentResponse = createCommentMutation(data);
        return { createCommentResponse };
    }, [createCommentMutation]);

    return { createComment, isLoading, isError };
};

const createCommentRequest = async (token: string, comment: BaseCommentData): Promise<CommentsProps> => {
    const response = await fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token,
        },
        body: JSON.stringify(comment)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`status: ${response.status}, message: ${JSON.stringify(data)}`);
    }
    return data;
}