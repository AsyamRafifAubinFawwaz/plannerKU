<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class InvitationReceived implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $invitation;
    public $targetUserId;

    public function __construct($invitation, $targetUserId)
    {
        $this->invitation = $invitation;
        $this->targetUserId = $targetUserId;
    }

    public function broadcastOn(): array
    {
        // Broadcast ke private channel milik user yang diundang
        return [
            new PrivateChannel('user.' . $this->targetUserId),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'invitation' => $this->invitation,
        ];
    }
}
