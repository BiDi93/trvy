<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'         => ['required', 'string', 'max:100'],
            'email'        => ['required', 'email', 'max:150', 'unique:users,email'],
            'password'     => ['required', 'string', 'min:8', 'confirmed'],
            'role'         => ['required', 'in:customer,freelancer'],
            'phone'        => ['nullable', 'string', 'max:20', 'unique:users,phone'],
            // freelancer only
            'bio'          => ['nullable', 'string', 'max:1000'],
            'location'     => ['nullable', 'string', 'max:100'],
            'hourly_rate'  => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
