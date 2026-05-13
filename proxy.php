<?php
declare(strict_types=1);

header('Content-Type: text/plain; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$player = trim((string)($_GET['player'] ?? ''));
$game = strtolower(trim((string)($_GET['game'] ?? 'rs3')));

if ($player === '') {
    http_response_code(400);
    echo 'Missing player parameter';
    exit;
}

if (!preg_match('/^[A-Za-z0-9 _-]{1,12}$/', $player)) {
    http_response_code(400);
    echo 'Invalid player parameter';
    exit;
}

$urls = [
    'rs3' => 'https://secure.runescape.com/m=hiscore/index_lite.ws',
    'osrs' => 'https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws',
];

if (!isset($urls[$game])) {
    http_response_code(400);
    echo 'Invalid game parameter. Use rs3 or osrs.';
    exit;
}

$targetUrl = $urls[$game] . '?player=' . rawurlencode($player);
$body = false;
$status = 502;

if (function_exists('curl_init')) {
    $ch = curl_init($targetUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT => 12,
        CURLOPT_USERAGENT => 'rsbg.kooheji.dev',
        CURLOPT_HEADER => false,
    ]);

    $body = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
} else {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 12,
            'header' => "User-Agent: rsbg.kooheji.dev\r\n",
        ],
    ]);

    $body = @file_get_contents($targetUrl, false, $context);

    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $matches)) {
        $status = (int)$matches[1];
    }
}

if ($body === false || $status < 200 || $status >= 300) {
    http_response_code($status >= 400 && $status < 600 ? $status : 502);
    echo 'Player not found or HiScores unavailable';
    exit;
}

header('Cache-Control: public, max-age=300');
echo $body;
