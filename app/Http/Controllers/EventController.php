<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        $events = auth()->user()->events()->orderBy('start_date', 'desc')->get();
        return Inertia::render('calendar/index', [
            'events' => $events
        ]);
    }

    public function store(StoreEventRequest $request)
    {
        auth()->user()->events()->create($request->validated());
        return back()->with('success', 'Event Berhasil di tambahkan');
    }

    public function update(UpdateEventRequest $request, Event $event)
    {
         $this->authorize('update', $event);
        $event->update($request->validated());
        return back()->with('success', 'Event berhasil di update');
    }

    public function destroy(Event $event)
    {
         $this->authorize('delete', $event);
        $event->delete();
        return back()->with('success', 'Event berhasil di hapus');
    }
}
