<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
      /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('task'));
    }

      /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'         => ['sometimes', 'string', 'max:200'],
            'category'      => ['sometimes', 'in:kuliah,harian,penting'],
            'due_date'      => ['nullable', 'date'],
            'notes'         => ['nullable', 'string'],
            'is_done'       => ['sometimes', 'boolean'],
            'attachments'   => ['nullable', 'array'],
            'attachments.*' => ['mimes:jpg,jpeg,png,webp,heic'],

        ];
    }
}
