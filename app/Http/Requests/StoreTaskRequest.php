<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Task::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
       public function rules(): array
    {
        return [
            'title'         => ['required', 'string', 'max:200'],
            'category'      => ['required', 'in:kuliah,harian,penting'],
            'due_date'      => ['nullable', 'date'],
            'notes'         => ['nullable', 'string'],
            'attachments'   => ['nullable', 'array'],
            'attachments.*' => ['file', 'mimes:jpg,jpeg,png,webp,heic'],
        ];
    }

}
