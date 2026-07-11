<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$user = App\Models\User::where('email', 'admin@min5tulungagung.sch.id')->first();
echo 'User found: ' . ($user ? 'Yes' : 'No') . PHP_EOL;
if ($user) {
    echo 'Password matches: ' . (password_verify('password', $user->password) ? 'Yes' : 'No') . PHP_EOL;
}
