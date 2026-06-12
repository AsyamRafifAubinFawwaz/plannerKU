<?php
$u = \App\Models\User::find(2);
try {
    $w = $u->ownedWorkspaces()->create(['name'=>'Test', 'description'=>'Test desc']);
    $w->members()->attach($u->id, ['role'=>'admin']);
    echo 'Success: Workspace ' . $w->id . "\n";
} catch (\Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
}
