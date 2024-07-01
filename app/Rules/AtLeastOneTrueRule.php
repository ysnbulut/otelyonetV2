<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class AtLeastOneTrueRule implements Rule
{
    private array $fields;
    private array $requestData;

    public function __construct(array $fields, array $requestData)
    {
        $this->fields = $fields;
        $this->requestData = $requestData;
    }

    public function passes($attribute, $value): bool
    {
        foreach ($this->fields as $field) {
            if (isset($this->requestData[$field]) && $this->requestData[$field]) {
                return true;
            }
        }

        return false;
    }

    public function message(): string
    {
        return 'En az bir seçenek seçilmelidir.';
    }
}