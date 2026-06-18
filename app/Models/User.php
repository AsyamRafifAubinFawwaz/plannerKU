<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use App\Models\Task;  

#[Fillable(['name', 'email', 'password', 'plan', 'plan_expires_at', 'wa_number'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'      => 'datetime',
            'password'               => 'hashed',
            'two_factor_confirmed_at'=> 'datetime',
            'plan_expires_at'        => 'datetime',
        ];
    }

    // ─────────────────────────────────────────
    // Relasi PlannerKu
    // ─────────────────────────────────────────

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function habits()
    {
        return $this->hasMany(Habit::class);
    }

    public function habitLogs()
    {
        return $this->hasMany(HabitLog::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function ownedWorkspaces()
    {
        return $this->hasMany(Workspace::class, 'owner_id');
    }

    public function workspaces()
    {
        return $this->belongsToMany(Workspace::class, 'workspace_user')->withPivot('role')->withTimestamps();
    }

    // ─────────────────────────────────────────
    // Helper plan
    // ─────────────────────────────────────────

    public function isPro(): bool
    {
        if ($this->plan === 'free') return false;

        return $this->plan_expires_at?->isFuture() ?? false;
    }

    public function isMax(): bool
    {
        if ($this->plan !== 'max') return false;

        return $this->plan_expires_at?->isFuture() ?? false;
    }

    public function isFree(): bool
    {
        return ! $this->isPro();
    }

    // ─────────────────────────────────────────
    // Limit fitur gratis — ubah nilai di sini
    // ─────────────────────────────────────────

    public function canAddTask(): bool
    {
        if ($this->isPro()) return true;

        $count = $this->tasks()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return $count < 10;
    }

    public function canAddHabit(): bool
    {
        if ($this->isPro()) return true;

        return $this->habits()->where('is_active', true)->count() < 3;
    }

    public function canAddEvent(): bool
    {
        if ($this->isPro()) return true;

        return $this->events()->count() < 10;
    }

    // ─────────────────────────────────────────
    // Limit Kolaborasi
    // ─────────────────────────────────────────

    /** Gratis: tidak bisa. Pro: bisa 1 workspace. Max: tak terbatas. */
    public function canCreateWorkspace(): bool
    {
        if ($this->isFree()) return false;
        if ($this->isMax()) return true;

        // Pro: maksimal 1 workspace yang dimiliki
        return $this->ownedWorkspaces()->count() < 1;
    }

    /** Hanya Max yang bisa mengundang anggota */
    public function canInviteMember(): bool
    {
        return $this->isMax();
    }

    /** Batas kolom per workspace: Pro = 3, Max = tak terbatas */
    public function maxColumnsPerWorkspace(): int
    {
        return $this->isMax() ? PHP_INT_MAX : 3;
    }

    /** Batas kartu per kolom: Pro = 10, Max = tak terbatas */
    public function maxTasksPerColumn(): int
    {
        return $this->isMax() ? PHP_INT_MAX : 10;
    }
}