<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;

class ResponseService
{
    /**
     * ✅ Success Response
     */
    public static function success(string $message, $data = null, int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $status);
    }

    /**
     * ✅ Error Response
     */
    public static function error(string $message, $error = null, int $status = 500): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'error' => $error
        ], $status);
    }

    /**
     * ✅ Validation Error Response
     */
    public static function validationError($errors): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $errors
        ], 422);
    }
}
