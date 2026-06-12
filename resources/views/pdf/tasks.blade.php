<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Jadwal Tugas</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 20px;
        }
        h1 {
            color: #FF6B1A;
            text-align: center;
        }
        .info {
            text-align: center;
            margin-bottom: 30px;
            color: #666;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f8f8f8;
            color: #444;
        }
        .status-done {
            color: #1D9E75;
            font-weight: bold;
        }
        .status-pending {
            color: #E24B4A;
        }
        .category {
            font-size: 11px;
            padding: 3px 6px;
            border-radius: 4px;
            background-color: #eee;
            text-transform: uppercase;
        }
    </style>
</head>
<body>

    <h1>Daftar Tugas PlannerKu</h1>
    <div class="info">
        <p>Milik: <strong>{{ $user->name }}</strong> (Paket Max)</p>
        <p>Dicetak pada: {{ now()->format('d M Y, H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Judul Tugas</th>
                <th>Kategori</th>
                <th>Tenggat Waktu</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($tasks as $task)
            <tr>
                <td>{{ $task->title }}</td>
                <td><span class="category">{{ $task->category }}</span></td>
                <td>{{ $task->due_date ? \Carbon\Carbon::parse($task->due_date)->format('d M Y') : '-' }}</td>
                <td>
                    @if($task->is_done)
                        <span class="status-done">Selesai ({{ \Carbon\Carbon::parse($task->done_at)->format('d M Y') }})</span>
                    @else
                        <span class="status-pending">Belum Selesai</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="4" style="text-align: center; color: #888;">Belum ada tugas.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

</body>
</html>
