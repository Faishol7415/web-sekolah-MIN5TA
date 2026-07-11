<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\SchoolProfile;

if (SchoolProfile::count() == 0) {
    SchoolProfile::create([
        'section' => 'history',
        'title' => 'Sejarah Singkat',
        'content' => '<p class="text-justify leading-relaxed">Sejarah MIN 5 Tulungagung bermula dari perubahan status MI PSM Rejotangan menjadi MI Negeri pada 25 Oktober 1993. Di bawah kepemimpinan Drs. Hardiyono, M.Ag. (2007–2014) dan kemudian H. Rohmad, S.Pd., madrasah ini mengalami kemajuan pesat, baik dari segi penataan manajerial, sarana prasarana, maupun peningkatan prestasi akademik dan non-akademik yang signifikan, sehingga menjadikannya salah satu madrasah favorit di tingkat kecamatan.</p>',
        'order' => 1,
        'is_active' => true
    ]);

    SchoolProfile::create([
        'section' => 'vision_mission',
        'title' => 'Visi & Misi',
        'content' => '<h3>Visi</h3><p>"Terwujudnya Madrasah yang unggul, lulusan yang bertaqwa, mandiri, cerdas, berbudaya lingkungan dan berkepribadian yang berlandaskan gotong royong."</p><h3>Misi</h3><ol><li>Meningkatkan manajemen pelayanan mutu</li><li>Meningkatkan kualitas pendidik & tenaga kependidikan</li><li>Meningkatkan sarana dan prasarana yang berkualitas</li></ol>',
        'order' => 2,
        'is_active' => true
    ]);
    
    SchoolProfile::create([
        'section' => 'principal',
        'title' => 'Sambutan Kepala Madrasah',
        'content' => '<p>Selamat datang di website resmi MIN 5 Tulungagung. Mari kita tingkatkan prestasi dan akhlak mulia bersama-sama.</p>',
        'order' => 3,
        'is_active' => true
    ]);
    echo "Seeded successfully.\n";
} else {
    echo "Already seeded.\n";
}
