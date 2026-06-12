<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class TaskExportController extends Controller
{
    public function downloadPdf(Request $request)
    {
        $user = $request->user();

        // Fitur ini khusus MAX
        if (!$user->isMax()) {
            abort(403, 'Fitur Export PDF khusus paket Max.');
        }

        $tasks = $user->tasks()->orderBy('due_date', 'asc')->get();

        $pdf = Pdf::loadView('pdf.tasks', [
            'tasks' => $tasks,
            'user' => $user,
        ]);

        return $pdf->download('Jadwal_Tugas_' . now()->format('Ymd') . '.pdf');
    }
}
