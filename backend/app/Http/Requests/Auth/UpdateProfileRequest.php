<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'         => ['sometimes', 'string', 'max:100'],
            'phone'        => ['sometimes', 'nullable', 'string', 'max:20', 'unique:users,phone,' . $this->user()->id],
            'avatar'       => ['sometimes', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'kyc_document' => ['sometimes', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            // freelancer profile fields
            'bio'          => ['sometimes', 'nullable', 'string', 'max:1000'],
            'location'     => ['sometimes', 'nullable', 'string', 'max:100'],
            'hourly_rate'  => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'availability' => ['sometimes', 'boolean'],
        ];
    }
}
