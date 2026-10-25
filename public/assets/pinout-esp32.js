(function () {
  'use strict';

  var P = Pinout.p;
  var R = String.raw;
  var N = function (pl, en) { return [pl, en]; };

  var T_IN = N('Tylko wejście, bez wewnętrznych rezystorów pull-up i pull-down.', 'Input only, no internal pull-up or pull-down resistors.');
  var T_ADC2 = N('ADC2 nie działa, gdy włączone jest Wi-Fi.', 'ADC2 does not work while Wi-Fi is on.');
  var W_FLASH = N('Połączony z pamięcią flash modułu. Nie używaj.', 'Wired to the module flash. Do not use.');

  var C = {
    0: ['ADC2_1 · T1', 'sys', ['dig', 'adc', 'pwm', 'touch', 'strap'], N('Przycisk BOOT na płytce.', 'The BOOT button on the board.'), N('LOW przy resecie włącza tryb flashowania. Ma wewnętrzny pull-up.', 'LOW at reset enters download mode. Has an internal pull-up.')],
    1: ['TX0', 'com', ['dig', 'pwm', 'uart'], N('UART0: konsola i flashowanie. Zajęty, gdy używasz Serial.', 'UART0: console and flashing. Taken when you use Serial.'), N('Wypisuje log startowy zaraz po resecie.', 'Prints the boot log right after reset.')],
    2: ['ADC2_2 · T2', 'sys', ['dig', 'adc', 'pwm', 'touch', 'strap'], T_ADC2, N('Musi być LOW lub niepodłączony podczas flashowania.', 'Must be LOW or floating while flashing.')],
    3: ['RX0', 'com', ['dig', 'pwm', 'uart'], N('UART0: konsola i flashowanie. Zajęty, gdy używasz Serial.', 'UART0: console and flashing. Taken when you use Serial.')],
    4: ['ADC2_0 · T0', 'adc', ['dig', 'adc', 'pwm', 'touch'], T_ADC2],
    5: ['VSPI CS', 'sys', ['dig', 'pwm', 'spi', 'strap'], N('Domyślny CS magistrali VSPI.', 'Default chip select of the VSPI bus.'), N('Pin startowy: nie wymuszaj LOW przy resecie.', 'Strapping pin: do not force LOW at reset.')],
    12: ['ADC2_5 · T5', 'sys', ['dig', 'adc', 'pwm', 'touch', 'spi', 'strap'], N('HSPI MISO. ' + T_ADC2[0], 'HSPI MISO. ' + T_ADC2[1]), N('Pin startowy (MTDI): HIGH przy starcie ustawia flash na 1,8 V i moduł się nie uruchomi. Nie podciągaj do 3V3.', 'Strapping pin (MTDI): HIGH at boot selects 1.8 V flash and the module will not boot. Do not pull up to 3V3.')],
    13: ['ADC2_4 · T4', 'adc', ['dig', 'adc', 'pwm', 'touch', 'spi'], N('HSPI MOSI. ' + T_ADC2[0], 'HSPI MOSI. ' + T_ADC2[1])],
    14: ['ADC2_6 · T6', 'adc', ['dig', 'adc', 'pwm', 'touch', 'spi'], N('HSPI SCK. ' + T_ADC2[0], 'HSPI SCK. ' + T_ADC2[1])],
    15: ['ADC2_3 · T3', 'sys', ['dig', 'adc', 'pwm', 'touch', 'spi', 'strap'], N('HSPI CS. ' + T_ADC2[0], 'HSPI CS. ' + T_ADC2[1]), N('Pin startowy (MTDO): LOW przy starcie wycisza log bootloadera. Ma wewnętrzny pull-up.', 'Strapping pin (MTDO): LOW at boot silences the bootloader log. Has an internal pull-up.')],
    16: ['U2RXD', 'com', ['dig', 'pwm', 'uart'], N('UART2 RX (Serial2).', 'UART2 RX (Serial2).'), N('W modułach WROVER zajęty przez PSRAM. Nie używaj tam.', 'Taken by PSRAM on WROVER modules. Do not use there.')],
    17: ['U2TXD', 'com', ['dig', 'pwm', 'uart'], N('UART2 TX (Serial2).', 'UART2 TX (Serial2).'), N('W modułach WROVER zajęty przez PSRAM. Nie używaj tam.', 'Taken by PSRAM on WROVER modules. Do not use there.')],
    18: ['VSPI SCK', 'com', ['dig', 'pwm', 'spi'], N('Domyślny SCK magistrali VSPI.', 'Default clock of the VSPI bus.')],
    19: ['VSPI MISO', 'com', ['dig', 'pwm', 'spi'], N('Domyślny MISO magistrali VSPI.', 'Default MISO of the VSPI bus.')],
    21: ['I²C SDA', 'com', ['dig', 'pwm', 'i2c'], N('Domyślny SDA biblioteki Wire.', 'Default SDA of the Wire library.')],
    22: ['I²C SCL', 'com', ['dig', 'pwm', 'i2c'], N('Domyślny SCL biblioteki Wire.', 'Default SCL of the Wire library.')],
    23: ['VSPI MOSI', 'com', ['dig', 'pwm', 'spi'], N('Domyślny MOSI magistrali VSPI.', 'Default MOSI of the VSPI bus.')],
    25: ['ADC2_8 · DAC1', 'adc', ['dig', 'adc', 'pwm', 'dac'], N('Prawdziwe wyjście analogowe 8 bit. ' + T_ADC2[0], 'True 8-bit analog output. ' + T_ADC2[1])],
    26: ['ADC2_9 · DAC2', 'adc', ['dig', 'adc', 'pwm', 'dac'], N('Prawdziwe wyjście analogowe 8 bit. ' + T_ADC2[0], 'True 8-bit analog output. ' + T_ADC2[1])],
    27: ['ADC2_7 · T7', 'adc', ['dig', 'adc', 'pwm', 'touch'], T_ADC2],
    32: ['ADC1_4 · T9', 'adc', ['dig', 'adc', 'pwm', 'touch'], N('ADC1 działa razem z Wi-Fi.', 'ADC1 works alongside Wi-Fi.')],
    33: ['ADC1_5 · T8', 'adc', ['dig', 'adc', 'pwm', 'touch'], N('ADC1 działa razem z Wi-Fi.', 'ADC1 works alongside Wi-Fi.')],
    34: ['ADC1_6', 'adc', ['dig', 'adc', 'in'], T_IN],
    35: ['ADC1_7', 'adc', ['dig', 'adc', 'in'], T_IN],
    36: ['VP · ADC1_0', 'adc', ['dig', 'adc', 'in'], T_IN],
    39: ['VN · ADC1_3', 'adc', ['dig', 'adc', 'in'], T_IN]
  };

  function c(n) {
    var d = C[n];
    return P('IO' + n, d[0], d[1], d[2], d[3], d[4]);
  }
  function fl(name, n) { return P(name, 'IO' + n, 'sys', ['flash'], null, W_FLASH); }
  function gnd() { return P('GND', '', 'gnd', ['pwr'], N('Masa. Wspólna dla wszystkich układów w projekcie.', 'Ground. Common to every part in your project.')); }
  function v33() { return P('3V3', '', 'pwr', ['pwr'], N('Wyjście 3,3 V z regulatora na płytce. Zasilaj nim czujniki i diody.', 'The 3.3 V output of the on-board regulator. Power sensors and LEDs from it.')); }
  function v5(n, x) { return P(n, '', 'pwr', ['pwr'], x); }
  function en() { return P('EN', 'CHIP_PU', 'sys', ['rst'], N('Reset modułu: LOW restartuje, HIGH (domyślnie) oznacza pracę.', 'Module reset: LOW restarts it, HIGH (default) means running.')); }

  var X5V = N('5 V z USB, gdy płytka jest zasilana kablem. Nie podawaj 5 V na piny GPIO.', '5 V from USB when the board is powered by cable. Never feed 5 V into a GPIO pin.');
  var XVIN = N('Wejście zasilania 5 V (lub wyjście z USB). Nie podawaj 5 V na piny GPIO.', '5 V power input (or USB output). Never feed 5 V into a GPIO pin.');

  var CLASSIC_USES = [
    N('Czujniki w sieci Wi-Fi: temperatura, wilgotność i jakość powietrza wysyłane do MQTT, Home Assistanta albo własnego serwera.', 'Wi-Fi sensors: temperature, humidity and air quality sent to MQTT, Home Assistant or your own server.'),
    N('Sterowanie przekaźnikami, LED-ami i silnikami z telefonu przez stronę WWW hostowaną na samej płytce.', 'Controlling relays, LEDs and motors from a phone through a web page served by the board itself.'),
    N('Urządzenia Bluetooth Low Energy: beacony, piloty, czujniki zasilane z baterii.', 'Bluetooth Low Energy devices: beacons, remotes, battery-powered sensors.'),
    N('Dźwięk i sygnały: DAC na GPIO25 i GPIO26 oraz I²S do mikrofonów i wzmacniaczy.', 'Audio and signals: DAC on GPIO25 and GPIO26, plus I²S for microphones and amplifiers.'),
    N('Przyciski dotykowe bez żadnych części dodatkowych (10 pinów pojemnościowych).', 'Touch buttons with no extra parts (10 capacitive pins).'),
    N('Ekrany OLED i TFT, karty SD, czujniki I²C i SPI w jednym projekcie dzięki dużej liczbie pinów.', 'OLED and TFT screens, SD cards, I²C and SPI sensors in one project thanks to plenty of pins.')
  ];

  function classicEx(led, ledWire) {
    return [
      { k: 'dig', t: N('Mruganie diodą', 'Blink an LED'), d: N('Wyjście cyfrowe daje 3,3 V albo 0 V. Dioda LED zawsze potrzebuje rezystora 220 Ω, bo pin nie ogranicza prądu.', 'A digital output gives 3.3 V or 0 V. An LED always needs a 220 Ω resistor because the pin does not limit current.'), w: ledWire,
        code: 'const int LED = ' + led + ';\n\nvoid setup() {\n  pinMode(LED, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED, HIGH);\n  delay(500);\n  digitalWrite(LED, LOW);\n  delay(500);\n}\n' },
      { k: 'dig', t: N('Przycisk z pull-upem', 'Button with pull-up'), d: N('INPUT_PULLUP włącza wewnętrzny rezystor, więc przycisk łączysz tylko z masą. Wciśnięty daje LOW.', 'INPUT_PULLUP turns on an internal resistor, so the button only goes to ground. Pressed reads LOW.'), w: N('GPIO4 → przycisk → GND', 'GPIO4 → button → GND'),
        code: R`const int BTN = 4;

void setup() {
  Serial.begin(115200);
  pinMode(BTN, INPUT_PULLUP);
}

void loop() {
  Serial.println(digitalRead(BTN) == LOW ? "pressed" : "released");
  delay(100);
}
` },
      { k: 'ana', t: N('Potencjometr i napięcie', 'Potentiometer and voltage'), d: N('GPIO34 należy do ADC1, który działa razem z Wi-Fi. analogReadMilliVolts zwraca wartość skorygowaną fabryczną kalibracją, dokładniejszą niż surowe 0 do 4095.', 'GPIO34 belongs to ADC1, which works alongside Wi-Fi. analogReadMilliVolts returns a value corrected by the factory calibration, more accurate than raw 0 to 4095.'), w: N('Środek potencjometru → GPIO34, skrajne → 3V3 i GND', 'Potentiometer wiper → GPIO34, outer legs → 3V3 and GND'),
        code: R`const int POT = 34;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
}

void loop() {
  int raw = analogRead(POT);
  int mv = analogReadMilliVolts(POT);
  Serial.printf("raw %d  %d mV\n", raw, mv);
  delay(200);
}
` },
      { k: 'ana', t: N('Płynne rozjaśnianie (PWM)', 'Smooth fade (PWM)'), d: N('W rdzeniu esp32 3.x pin przypinasz do kanału LEDC jedną funkcją ledcAttach, a potem piszesz wypełnienie przez ledcWrite. Działa na każdym pinie wyjściowym.', 'In esp32 core 3.x you attach a pin to an LEDC channel with one call, ledcAttach, then write the duty with ledcWrite. Works on any output pin.'), w: N('GPIO18 → rezystor 220 Ω → anoda LED, katoda → GND', 'GPIO18 → 220 Ω resistor → LED anode, cathode → GND'),
        code: R`const int LED = 18;

void setup() {
  ledcAttach(LED, 5000, 8);
}

void loop() {
  for (int d = 0; d <= 255; d++) {
    ledcWrite(LED, d);
    delay(5);
  }
  for (int d = 255; d >= 0; d--) {
    ledcWrite(LED, d);
    delay(5);
  }
}
` },
      { k: 'ana', t: N('Prawdziwe napięcie z DAC', 'True voltage from the DAC'), d: N('GPIO25 i GPIO26 mają prawdziwy przetwornik cyfrowo-analogowy 8 bit: wartość 0 do 255 to 0 do 3,3 V. Przydatne do generatora przebiegów albo sterowania wejściem analogowym.', 'GPIO25 and GPIO26 have a real 8-bit digital-to-analog converter: 0 to 255 maps to 0 to 3.3 V. Handy for a waveform generator or driving an analog input.'), w: N('GPIO25 → woltomierz lub oscyloskop, masa → GND', 'GPIO25 → voltmeter or scope, ground → GND'),
        code: R`void setup() {
}

void loop() {
  for (int v = 0; v < 256; v++) {
    dacWrite(25, v);
    delay(10);
  }
}
` },
      { k: 'ana', t: N('Przycisk dotykowy', 'Touch button'), d: N('touchRead zwraca liczbę, która spada, gdy dotykasz pinu palcem. Dobierz próg doświadczalnie, bo zależy od długości przewodu.', 'touchRead returns a number that drops when you touch the pin. Pick the threshold by experiment, because it depends on wire length.'), w: N('GPIO32 → kawałek przewodu lub folia miedziana', 'GPIO32 → a bare wire or copper foil pad'),
        code: R`void setup() {
  Serial.begin(115200);
}

void loop() {
  Serial.println(touchRead(32));
  delay(200);
}
` },
      { k: 'bus', t: N('Skaner I²C', 'I²C scanner'), d: N('Wypisuje adresy wszystkich urządzeń na magistrali, więc od razu widać, czy czujnik jest dobrze podłączony.', 'Prints the address of every device on the bus, so you immediately see whether a sensor is wired correctly.'), w: N('GPIO21 → SDA, GPIO22 → SCL, zasilanie 3V3 i GND', 'GPIO21 → SDA, GPIO22 → SCL, power 3V3 and GND'),
        code: R`#include <Wire.h>

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
}

void loop() {
  for (byte a = 1; a < 127; a++) {
    Wire.beginTransmission(a);
    if (Wire.endTransmission() == 0) Serial.printf("found 0x%02X\n", a);
  }
  delay(2000);
}
` }
    ];
  }

  var IDE_CLASSIC_STEPS = [
    N('W File → Preferences wklej adres z góry do pola Additional boards manager URLs.', 'In File → Preferences paste the URL above into Additional boards manager URLs.'),
    N('Otwórz Boards Manager, wyszukaj esp32 i zainstaluj „esp32 by Espressif Systems”.', 'Open Boards Manager, search for esp32 and install “esp32 by Espressif Systems”.'),
    N('W Tools → Board → esp32 wybierz ESP32 Dev Module.', 'In Tools → Board → esp32 choose ESP32 Dev Module.'),
    N('Podłącz kabel USB z liniami danych. Jeśli port się nie pojawia, zainstaluj sterownik mostka USB-UART z tabeli parametrów.', 'Plug in a USB cable that carries data. If no port shows up, install the driver for the USB-UART bridge listed in the specs.'),
    N('W Tools → Port wybierz nowy port szeregowy i kliknij Upload.', 'In Tools → Port pick the new serial port and click Upload.'),
    N('Jeśli w konsoli wisi „Connecting…”, przytrzymaj BOOT, dotknij EN i puść BOOT, gdy ruszy wgrywanie.', 'If the console hangs on “Connecting…”, hold BOOT, tap EN and release BOOT once the upload starts.'),
    N('Serial Monitor ustaw na 115200 baud, czyli tyle, ile w Serial.begin. To inna prędkość niż Upload Speed.', 'Set Serial Monitor to 115200 baud, matching Serial.begin. That is a different speed from Upload Speed.')
  ];

  var IDE_CLASSIC_TIPS = [
    N('Błąd „A fatal error occurred: Failed to connect”: kabel bez danych, zły port albo brak trybu flashowania. Wejdź w tryb ręcznie przyciskami BOOT i EN.', 'Error “A fatal error occurred: Failed to connect”: charge-only cable, wrong port or the chip is not in download mode. Enter it by hand with BOOT and EN.'),
    N('Wgrywanie urywa się w połowie: zmniejsz Upload Speed do 460800 albo 115200.', 'Upload cuts out halfway: lower Upload Speed to 460800 or 115200.'),
    N('Płytka restartuje się w kółko po wgraniu: sprawdź, czy nic nie ciągnie pinów startowych (GPIO0, 2, 5, 12, 15) w złą stronę.', 'Board reboots in a loop after upload: check that nothing pulls the strapping pins (GPIO0, 2, 5, 12, 15) the wrong way.'),
    N('Po wgraniu nic się nie dzieje w Serial Monitor: baud musi się zgadzać z Serial.begin, a płytkę warto zresetować przyciskiem EN.', 'Nothing in Serial Monitor after upload: the baud must match Serial.begin, and it helps to reset the board with EN.')
  ];

  function classicIde(flash, partition, boardNote) {
    return {
      url: 'https://espressif.github.io/arduino-esp32/package_esp32_index.json',
      rows: [
        ['Board', 'ESP32 Dev Module', boardNote],
        ['Upload Speed', '921600', N('Szybko i zwykle stabilnie. Przy błędach zejdź do 460800 lub 115200.', 'Fast and usually stable. If uploads fail, drop to 460800 or 115200.')],
        ['CPU Frequency', '240MHz (WiFi/BT)', N('Pełna prędkość. Niższe taktowanie oszczędza prąd, ale Wi-Fi i BT wymagają co najmniej 80 MHz.', 'Full speed. Lower clocks save power, but Wi-Fi and BT need at least 80 MHz.')],
        ['Flash Frequency', '80MHz', N('Standard dla modułów WROOM.', 'Standard for WROOM modules.')],
        ['Flash Mode', 'DIO', N('Bezpieczny wybór dla każdego modułu. QIO jest szybszy, ale nie każdy klon go lubi.', 'Safe for any module. QIO is faster but not every clone likes it.')],
        ['Flash Size', flash, N('Dopasuj do modułu. Zła wartość psuje tablicę partycji.', 'Match your module. A wrong value breaks the partition table.')],
        ['Partition Scheme', partition, N('Domyślny podział na aplikację i system plików. Do OTA wybierz schemat z dwiema aplikacjami.', 'The default split between app and file system. For OTA pick a scheme with two app slots.')],
        ['PSRAM', 'Disabled', N('Włącz tylko dla modułu WROVER, który ma PSRAM.', 'Enable only for a WROVER module, which has PSRAM.')],
        ['Core Debug Level', 'None', N('Wyższe poziomy dopisują logi do konsoli, przydatne przy szukaniu błędów Wi-Fi.', 'Higher levels add logs to the console, useful when chasing Wi-Fi bugs.')],
        ['Erase All Flash Before Sketch Upload', 'Disabled', N('Włącz raz, gdy chcesz wyczyścić zapisane hasła Wi-Fi i pamięć NVS.', 'Turn on once when you want to wipe saved Wi-Fi credentials and NVS storage.')],
        ['Port', 'COMx / /dev/ttyUSBx', N('Pojawia się po podłączeniu płytki.', 'Shows up once the board is plugged in.')]
      ],
      steps: IDE_CLASSIC_STEPS,
      tips: IDE_CLASSIC_TIPS
    };
  }

  var LED_WIRE = N('GPIO23 → rezystor 220 Ω → anoda LED, katoda → GND', 'GPIO23 → 220 Ω resistor → LED anode, cathode → GND');
  var LED2_WIRE = N('Wbudowana dioda jest na GPIO2, nic nie musisz podłączać', 'The on-board LED is on GPIO2, nothing to wire');

  var spec38 = [
    ['Moduł', 'Module', 'ESP32-WROOM-32E'],
    ['Procesor', 'CPU', N('2 rdzenie Xtensa LX6, do 240 MHz', '2 Xtensa LX6 cores, up to 240 MHz')],
    ['Łączność', 'Wireless', N('Wi-Fi 802.11 b/g/n, Bluetooth 4.2 i BLE', 'Wi-Fi 802.11 b/g/n, Bluetooth 4.2 and BLE')],
    ['Pamięć', 'Memory', N('520 KB SRAM, flash zwykle 4 MB', '520 KB SRAM, flash usually 4 MB')],
    ['Poziom logiczny', 'Logic level', N('3,3 V, piny nie są odporne na 5 V', '3.3 V, pins are not 5 V tolerant')],
    ['ADC', 'ADC', N('12 bit, 18 kanałów (ADC1 i ADC2)', '12-bit, 18 channels (ADC1 and ADC2)')],
    ['DAC', 'DAC', N('2 kanały 8 bit (GPIO25, GPIO26)', '2 channels, 8-bit (GPIO25, GPIO26)')],
    ['Dotyk', 'Touch', N('10 pinów pojemnościowych', '10 capacitive pins')],
    ['USB', 'USB', N('Micro-USB, mostek CP2102N (sterownik CP210x)', 'Micro-USB, CP2102N bridge (CP210x driver)')],
    ['Zasilanie', 'Power', N('5 V z USB albo pin 5V, regulator 3,3 V na płytce', '5 V from USB or the 5V pin, 3.3 V regulator on board')],
    ['Prąd pinu', 'Pin current', N('zalecane do ok. 20 mA, absolutne maksimum 40 mA', 'about 20 mA recommended, 40 mA absolute max')]
  ];

  Pinout.add({
    id: 'esp32-38',
    family: 'esp32',
    tab: 'DevKitC 38',
    name: N('ESP32-DevKitC, 38 pinów', 'ESP32-DevKitC, 38 pins'),
    pcb: 'esp',
    w: 266, h: 520, r: 16, fs: 12, show: 640,
    pad: { l: 190, r: 190, t: 14, b: 40 },
    holes: [[14, 14], [252, 14], [14, 506], [252, 506]],
    feats: [
      { t: 'ant', x: 49, y: 8, w: 168, h: 60 },
      { t: 'mod', x: 49, y: 68, w: 168, h: 150, txt: 'ESP32-WROOM-32E' },
      { t: 'txt', x: 133, y: 262, txt: 'ESP32-DevKitC V4', big: true },
      { t: 'ic', x: 103, y: 320, w: 60, h: 40, txt: 'CP2102N' },
      { t: 'ic', x: 114, y: 384, w: 38, h: 20, txt: 'LDO' },
      { t: 'led', x: 76, y: 330, c: 'red' },
      { t: 'btn', x: 64, y: 448, txt: 'EN' },
      { t: 'btn', x: 202, y: 448, txt: 'BOOT' },
      { t: 'usb', x: 103, y: 496, w: 60, h: 34, txt: 'micro-USB' }
    ],
    headers: [
      { x: 14, y: 52, dir: 'v', out: 'l', pins: [v33(), en(), c(36), c(39), c(34), c(35), c(32), c(33), c(25), c(26), c(27), c(14), c(12), gnd(), c(13), fl('SD2', 9), fl('SD3', 10), fl('CMD', 11), v5('5V', X5V)] },
      { x: 252, y: 52, dir: 'v', out: 'r', pins: [gnd(), c(23), c(22), c(1), c(3), c(21), gnd(), c(19), c(18), c(5), c(17), c(16), c(4), c(0), c(2), c(15), fl('SD1', 8), fl('SD0', 7), fl('CLK', 6)] }
    ],
    desc: [
      N('Oficjalna płytka Espressif z modułem ESP32-WROOM-32E. Ma 38 pinów (2 rzędy po 19), przyciski BOOT i EN oraz mostek USB-UART, więc wgrywasz program zwykłym kablem micro-USB.', 'The official Espressif board with an ESP32-WROOM-32E module. It has 38 pins (two rows of 19), BOOT and EN buttons and a USB-UART bridge, so you flash it with a plain micro-USB cable.'),
      N('To najlepszy punkt odniesienia: układ pinów jest opisany w dokumentacji Espressif i kopiuje go większość tańszych klonów. Jeśli Twoja płytka ma 38 pinów, ten rysunek prawie na pewno do niej pasuje, ale zawsze porównaj opisy z sitodrukiem.', 'This is the best reference: the pin layout is documented by Espressif and most cheaper clones copy it. If your board has 38 pins this drawing almost certainly fits, but always compare the names with the silkscreen.')
    ],
    uses: CLASSIC_USES,
    specs: spec38,
    ex: classicEx(23, LED_WIRE),
    ide: classicIde('4MB (32Mb)', 'Default 4MB with spiffs (1.2MB APP/1.5MB SPIFFS)', N('Pakiet „esp32 by Espressif Systems”. Dla modułu WROVER wybierz ESP32 Wrover Module.', 'From the package “esp32 by Espressif Systems”. For a WROVER module pick ESP32 Wrover Module.'))
  });

  Pinout.add({
    id: 'esp32-30',
    family: 'esp32',
    tab: 'DevKit 30',
    name: N('ESP32 DevKit, 30 pinów (klon DOIT)', 'ESP32 DevKit, 30 pins (DOIT clone)'),
    pcb: 'esp',
    w: 250, h: 440, r: 16, fs: 12, show: 620,
    pad: { l: 190, r: 190, t: 14, b: 40 },
    holes: [[14, 14], [236, 14], [14, 426], [236, 426]],
    feats: [
      { t: 'ant', x: 41, y: 8, w: 168, h: 52 },
      { t: 'mod', x: 41, y: 60, w: 168, h: 140, txt: 'ESP-WROOM-32' },
      { t: 'txt', x: 125, y: 240, txt: 'ESP32 DEVKIT V1', big: true },
      { t: 'ic', x: 99, y: 290, w: 52, h: 34, txt: 'CP2102' },
      { t: 'led', x: 125, y: 350, c: 'blue', txt: 'GPIO2' },
      { t: 'btn', x: 64, y: 388, txt: 'EN' },
      { t: 'btn', x: 186, y: 388, txt: 'BOOT' },
      { t: 'usb', x: 95, y: 416, w: 60, h: 30, txt: 'micro-USB' }
    ],
    headers: [
      { x: 17, y: 60, dir: 'v', out: 'l', pins: [en(), c(36), c(39), c(34), c(35), c(32), c(33), c(25), c(26), c(27), c(14), c(12), c(13), gnd(), v5('VIN', XVIN)] },
      {
        x: 233, y: 60, dir: 'v', out: 'r', pins: [c(23), c(22), c(1), c(3), c(21), c(19), c(18), c(5), c(17), c(16), c(4),
          P('IO2', 'ADC2_2 · T2 · LED', 'sys', ['dig', 'adc', 'pwm', 'touch', 'strap', 'led'], N('Wbudowana niebieska dioda świeci przy HIGH. ' + T_ADC2[0], 'The on-board blue LED lights on HIGH. ' + T_ADC2[1]), N('Musi być LOW lub niepodłączony podczas flashowania.', 'Must be LOW or floating while flashing.')),
          c(15), gnd(), v33()]
      }
    ],
    desc: [
      N('Najpopularniejsza tania płytka z ESP32: 30 pinów (2 rzędy po 15), układ DOIT DevKit V1. Nazwa „DevKitC 30 pin” w sklepach oznacza zwykle właśnie ją, a nie oficjalną płytkę Espressif, która ma 38 pinów.', 'The most popular budget ESP32 board: 30 pins (two rows of 15), the DOIT DevKit V1 layout. The name “DevKitC 30 pin” in shops usually means this one, not the official Espressif board, which has 38 pins.'),
      N('Pamiętaj o dwóch różnicach względem wersji 38-pinowej: GPIO0 nie jest wyprowadzony (do trybu flashowania służy przycisk BOOT), a na GPIO2 jest wbudowana dioda. Producenci klonów różnią się kolejnością pinów, więc sprawdź sitodruk.', 'Two differences from the 38-pin version: GPIO0 is not broken out (use the BOOT button for download mode) and there is an on-board LED on GPIO2. Clone makers differ in pin order, so check the silkscreen.')
    ],
    uses: CLASSIC_USES,
    specs: [
      ['Moduł', 'Module', 'ESP32-WROOM-32'],
      ['Procesor', 'CPU', N('2 rdzenie Xtensa LX6, do 240 MHz', '2 Xtensa LX6 cores, up to 240 MHz')],
      ['Łączność', 'Wireless', N('Wi-Fi 802.11 b/g/n, Bluetooth 4.2 i BLE', 'Wi-Fi 802.11 b/g/n, Bluetooth 4.2 and BLE')],
      ['Pamięć', 'Memory', N('520 KB SRAM, flash zwykle 4 MB', '520 KB SRAM, flash usually 4 MB')],
      ['Poziom logiczny', 'Logic level', N('3,3 V, piny nie są odporne na 5 V', '3.3 V, pins are not 5 V tolerant')],
      ['ADC', 'ADC', N('12 bit, do 18 kanałów, część wyprowadzona', '12-bit, up to 18 channels, some broken out')],
      ['DAC', 'DAC', N('2 kanały 8 bit (GPIO25, GPIO26)', '2 channels, 8-bit (GPIO25, GPIO26)')],
      ['Dotyk', 'Touch', N('9 pinów pojemnościowych na złączach', '9 capacitive pins on the headers')],
      ['USB', 'USB', N('Micro-USB, mostek CP2102 albo CH340 zależnie od klona', 'Micro-USB, CP2102 or CH340 bridge depending on the clone')],
      ['Zasilanie', 'Power', N('5 V z USB albo pin VIN, regulator 3,3 V na płytce', '5 V from USB or the VIN pin, 3.3 V regulator on board')],
      ['Prąd pinu', 'Pin current', N('zalecane do ok. 20 mA, absolutne maksimum 40 mA', 'about 20 mA recommended, 40 mA absolute max')]
    ],
    ex: classicEx(2, LED2_WIRE),
    ide: classicIde('4MB (32Mb)', 'Default 4MB with spiffs (1.2MB APP/1.5MB SPIFFS)', N('Pakiet „esp32 by Espressif Systems”. Pasuje też wpis DOIT ESP32 DEVKIT V1, ale ESP32 Dev Module działa tak samo.', 'From the package “esp32 by Espressif Systems”. The DOIT ESP32 DEVKIT V1 entry also fits, but ESP32 Dev Module behaves the same.'))
  });

  var S3 = {
    0: ['BOOT', 'sys', ['dig', 'pwm', 'strap'], N('Przycisk BOOT na płytce.', 'The BOOT button on the board.'), N('LOW przy resecie włącza tryb flashowania. Ma wewnętrzny pull-up.', 'LOW at reset enters download mode. Has an internal pull-up.')],
    1: ['ADC1_0 · T1', 'adc', ['dig', 'adc', 'pwm', 'touch']],
    2: ['ADC1_1 · T2', 'adc', ['dig', 'adc', 'pwm', 'touch']],
    3: ['ADC1_2 · T3', 'sys', ['dig', 'adc', 'pwm', 'touch', 'strap'], null, N('Pin startowy: wybiera źródło JTAG. Nie wymuszaj stanu przy resecie.', 'Strapping pin: selects the JTAG source. Do not force a level at reset.')],
    4: ['ADC1_3 · T4', 'adc', ['dig', 'adc', 'pwm', 'touch']],
    5: ['ADC1_4 · T5', 'adc', ['dig', 'adc', 'pwm', 'touch']],
    6: ['ADC1_5 · T6', 'adc', ['dig', 'adc', 'pwm', 'touch']],
    7: ['ADC1_6 · T7', 'adc', ['dig', 'adc', 'pwm', 'touch']],
    8: ['ADC1_7 · SDA', 'com', ['dig', 'adc', 'pwm', 'touch', 'i2c'], N('Domyślny SDA biblioteki Wire w rdzeniu Arduino.', 'Default SDA of the Wire library in the Arduino core.')],
    9: ['ADC1_8 · SCL', 'com', ['dig', 'adc', 'pwm', 'touch', 'i2c'], N('Domyślny SCL biblioteki Wire w rdzeniu Arduino.', 'Default SCL of the Wire library in the Arduino core.')],
    10: ['ADC1_9 · SS', 'com', ['dig', 'adc', 'pwm', 'touch', 'spi'], N('Domyślny CS magistrali SPI w rdzeniu Arduino.', 'Default chip select of the SPI bus in the Arduino core.')],
    11: ['ADC2_0 · MOSI', 'com', ['dig', 'adc', 'pwm', 'touch', 'spi'], N('Domyślny MOSI magistrali SPI. ' + T_ADC2[0], 'Default MOSI of the SPI bus. ' + T_ADC2[1])],
    12: ['ADC2_1 · SCK', 'com', ['dig', 'adc', 'pwm', 'touch', 'spi'], N('Domyślny SCK magistrali SPI. ' + T_ADC2[0], 'Default clock of the SPI bus. ' + T_ADC2[1])],
    13: ['ADC2_2 · MISO', 'com', ['dig', 'adc', 'pwm', 'touch', 'spi'], N('Domyślny MISO magistrali SPI. ' + T_ADC2[0], 'Default MISO of the SPI bus. ' + T_ADC2[1])],
    14: ['ADC2_3 · T14', 'adc', ['dig', 'adc', 'pwm', 'touch'], T_ADC2],
    15: ['ADC2_4 · 32K_P', 'adc', ['dig', 'adc', 'pwm'], T_ADC2],
    16: ['ADC2_5 · 32K_N', 'adc', ['dig', 'adc', 'pwm'], T_ADC2],
    17: ['ADC2_6 · U1TXD', 'com', ['dig', 'adc', 'pwm', 'uart'], N('Domyślny TX drugiego UART-a (Serial1). ' + T_ADC2[0], 'Default TX of the second UART (Serial1). ' + T_ADC2[1])],
    18: ['ADC2_7 · U1RXD', 'com', ['dig', 'adc', 'pwm', 'uart'], N('Domyślny RX drugiego UART-a (Serial1). ' + T_ADC2[0], 'Default RX of the second UART (Serial1). ' + T_ADC2[1])],
    19: ['ADC2_8 · USB D-', 'sys', ['dig', 'adc', 'pwm', 'usb'], N('Linia natywnego USB. ' + T_ADC2[0], 'Native USB line. ' + T_ADC2[1]), N('Jako GPIO tylko wtedy, gdy nie używasz portu USB.', 'Use as GPIO only when you do not use the USB port.')],
    20: ['ADC2_9 · USB D+', 'sys', ['dig', 'adc', 'pwm', 'usb'], N('Linia natywnego USB. ' + T_ADC2[0], 'Native USB line. ' + T_ADC2[1]), N('Jako GPIO tylko wtedy, gdy nie używasz portu USB.', 'Use as GPIO only when you do not use the USB port.')],
    21: ['', 'io', ['dig', 'pwm']],
    35: ['PSRAM', 'sys', ['dig', 'pwm'], null, N('Zajęty przez octal PSRAM w wariantach R8, na przykład N8R8. Nie używaj tam.', 'Taken by the octal PSRAM on R8 variants such as N8R8. Do not use there.')],
    36: ['PSRAM', 'sys', ['dig', 'pwm'], null, N('Zajęty przez octal PSRAM w wariantach R8, na przykład N8R8. Nie używaj tam.', 'Taken by the octal PSRAM on R8 variants such as N8R8. Do not use there.')],
    37: ['PSRAM', 'sys', ['dig', 'pwm'], null, N('Zajęty przez octal PSRAM w wariantach R8, na przykład N8R8. Nie używaj tam.', 'Taken by the octal PSRAM on R8 variants such as N8R8. Do not use there.')],
    38: ['RGB LED v1.1', 'io', ['dig', 'pwm', 'led'], N('Adresowalna dioda RGB WS2812 w płytce w wersji v1.1. W wersji v1.0 jest na GPIO48.', 'The addressable WS2812 RGB LED on board revision v1.1. On v1.0 it is on GPIO48.')],
    39: ['MTCK', 'io', ['dig', 'pwm'], N('Pin JTAG, wolny gdy nie debugujesz sprzętowo.', 'A JTAG pin, free when you are not hardware debugging.')],
    40: ['MTDO', 'io', ['dig', 'pwm'], N('Pin JTAG, wolny gdy nie debugujesz sprzętowo.', 'A JTAG pin, free when you are not hardware debugging.')],
    41: ['MTDI', 'io', ['dig', 'pwm'], N('Pin JTAG, wolny gdy nie debugujesz sprzętowo.', 'A JTAG pin, free when you are not hardware debugging.')],
    42: ['MTMS', 'io', ['dig', 'pwm'], N('Pin JTAG, wolny gdy nie debugujesz sprzętowo.', 'A JTAG pin, free when you are not hardware debugging.')],
    43: ['TX · U0TXD', 'com', ['dig', 'pwm', 'uart'], N('UART0: do mostka USB-UART (port oznaczony UART).', 'UART0: to the USB-UART bridge (the port marked UART).')],
    44: ['RX · U0RXD', 'com', ['dig', 'pwm', 'uart'], N('UART0: do mostka USB-UART (port oznaczony UART).', 'UART0: to the USB-UART bridge (the port marked UART).')],
    45: ['VDD_SPI', 'sys', ['dig', 'pwm', 'strap'], null, N('Pin startowy: wybiera napięcie VDD_SPI. Nie wymuszaj HIGH przy resecie.', 'Strapping pin: selects the VDD_SPI voltage. Do not force HIGH at reset.')],
    46: ['ROM log', 'sys', ['dig', 'pwm', 'strap'], null, N('Pin startowy: wpływa na tryb startu i log ROM. Nie wymuszaj stanu przy resecie.', 'Strapping pin: affects boot mode and the ROM log. Do not force a level at reset.')],
    47: ['', 'io', ['dig', 'pwm']],
    48: ['RGB LED v1.0', 'io', ['dig', 'pwm', 'led'], N('Adresowalna dioda RGB tylko w wersji płytki v1.0. W v1.1 pin jest wolny.', 'The RGB LED on board revision v1.0 only. On v1.1 the pin is free.')]
  };

  function s3(n) {
    var d = S3[n];
    return P('IO' + n, d[0], d[1], d[2], d[3], d[4]);
  }
  function s3x(name, n) {
    var p = s3(n);
    p.n = name;
    p.s = 'IO' + n + (p.s ? ' · ' + p.s.split(' · ').pop() : '');
    return p;
  }

  Pinout.add({
    id: 'esp32-s3',
    family: 'esp32',
    tab: 'ESP32-S3',
    name: N('ESP32-S3-DevKitC-1 (v1.1)', 'ESP32-S3-DevKitC-1 (v1.1)'),
    pcb: 'esp',
    w: 250, h: 600, r: 16, fs: 12, show: 620,
    pad: { l: 200, r: 200, t: 14, b: 40 },
    holes: [[14, 14], [236, 14], [14, 586], [236, 586]],
    feats: [
      { t: 'ant', x: 41, y: 8, w: 168, h: 52 },
      { t: 'mod', x: 41, y: 60, w: 168, h: 170, txt: 'ESP32-S3-WROOM-1' },
      { t: 'txt', x: 125, y: 272, txt: 'ESP32-S3-DevKitC-1', big: true },
      { t: 'led', x: 125, y: 318, c: 'rgb', txt: 'GPIO38' },
      { t: 'ic', x: 100, y: 410, w: 50, h: 34, txt: 'CP2102N' },
      { t: 'btn', x: 64, y: 520, txt: 'BOOT' },
      { t: 'btn', x: 186, y: 520, txt: 'RST' },
      { t: 'usb', x: 52, y: 574, w: 64, h: 32, txt: 'USB-UART' },
      { t: 'usb', x: 134, y: 574, w: 64, h: 32, txt: 'USB' }
    ],
    headers: [
      { x: 17, y: 50, dir: 'v', out: 'l', pins: [v33(), v33(), P('RST', 'CHIP_PU', 'sys', ['rst'], N('Reset modułu: LOW restartuje, HIGH (domyślnie) oznacza pracę.', 'Module reset: LOW restarts it, HIGH (default) means running.')), s3(4), s3(5), s3(6), s3(7), s3(15), s3(16), s3(17), s3(18), s3(8), s3(3), s3(46), s3(9), s3(10), s3(11), s3(12), s3(13), s3(14), v5('5V', X5V), gnd()] },
      { x: 233, y: 50, dir: 'v', out: 'r', pins: [gnd(), s3x('TX', 43), s3x('RX', 44), s3(1), s3(2), s3(42), s3(41), s3(40), s3(39), s3(38), s3(37), s3(36), s3(35), s3(0), s3(45), s3(48), s3(47), s3(21), s3(20), s3(19), gnd(), gnd()] }
    ],
    desc: [
      N('Płytka Espressif z układem ESP32-S3: dwa rdzenie, Wi-Fi, Bluetooth 5 (LE), natywne USB i instrukcje wektorowe dla uczenia maszynowego. Ma 44 piny (2 rzędy po 22), dwa porty USB i adresowalną diodę RGB.', 'An Espressif board with the ESP32-S3: two cores, Wi-Fi, Bluetooth 5 (LE), native USB and vector instructions for machine learning. It has 44 pins (two rows of 22), two USB ports and an addressable RGB LED.'),
      N('Port UART idzie przez mostek USB-UART (stabilny do flashowania i konsoli), a port USB to natywne USB układu: emuluje port szeregowy, klawiaturę, mysz albo dysk. Wersja v1.1 ma diodę RGB na GPIO38, starsza v1.0 na GPIO48.', 'The UART port goes through a USB-UART bridge (stable for flashing and console), and the USB port is the chip native USB: it can act as a serial port, keyboard, mouse or drive. Revision v1.1 has the RGB LED on GPIO38, the older v1.0 on GPIO48.')
    ],
    uses: [
      N('Urządzenia z natywnym USB: klawiatury, myszy, pady, dyski i porty szeregowe bez dodatkowego układu.', 'Native USB devices: keyboards, mice, gamepads, drives and serial ports with no extra chip.'),
      N('Kamera i obraz: wystarczająco dużo pamięci PSRAM i pinów na kamerę oraz ekrany.', 'Camera and display projects: enough PSRAM and pins for cameras and screens.'),
      N('Lokalne rozpoznawanie głosu i obrazu dzięki instrukcjom wektorowym do uczenia maszynowego.', 'Local voice and image recognition thanks to vector instructions for machine learning.'),
      N('Wiele czujników naraz: 20 kanałów ADC, 14 pinów dotykowych i trzy porty UART.', 'Many sensors at once: 20 ADC channels, 14 touch pins and three UART ports.'),
      N('Wszystko, co robi zwykłe ESP32: serwery WWW, MQTT, BLE i sterowanie przekaźnikami.', 'Everything a regular ESP32 does: web servers, MQTT, BLE and relay control.')
    ],
    specs: [
      ['Moduł', 'Module', N('ESP32-S3-WROOM-1 (warianty N8, N8R8 i inne)', 'ESP32-S3-WROOM-1 (N8, N8R8 and other variants)')],
      ['Procesor', 'CPU', N('2 rdzenie Xtensa LX7, do 240 MHz', '2 Xtensa LX7 cores, up to 240 MHz')],
      ['Łączność', 'Wireless', N('Wi-Fi 802.11 b/g/n i Bluetooth 5 (LE)', 'Wi-Fi 802.11 b/g/n and Bluetooth 5 (LE)')],
      ['Pamięć', 'Memory', N('512 KB SRAM, flash 8 MB w N8, PSRAM 8 MB w R8', '512 KB SRAM, 8 MB flash on N8, 8 MB PSRAM on R8')],
      ['Poziom logiczny', 'Logic level', N('3,3 V, piny nie są odporne na 5 V', '3.3 V, pins are not 5 V tolerant')],
      ['ADC', 'ADC', N('12 bit, 20 kanałów (ADC1: GPIO1 do 10, ADC2: GPIO11 do 20)', '12-bit, 20 channels (ADC1: GPIO1 to 10, ADC2: GPIO11 to 20)')],
      ['Dotyk', 'Touch', N('14 pinów pojemnościowych (GPIO1 do 14)', '14 capacitive pins (GPIO1 to 14)')],
      ['USB', 'USB', N('Port USB-UART (mostek CP2102N) i port natywnego USB (GPIO19, GPIO20)', 'A USB-UART port (CP2102N bridge) and a native USB port (GPIO19, GPIO20)')],
      ['Dioda RGB', 'RGB LED', N('WS2812 na GPIO38 (v1.1) albo GPIO48 (v1.0)', 'WS2812 on GPIO38 (v1.1) or GPIO48 (v1.0)')],
      ['Zasilanie', 'Power', N('5 V z USB albo pin 5V, regulator 3,3 V na płytce', '5 V from USB or the 5V pin, 3.3 V regulator on board')]
    ],
    ex: [
      { k: 'dig', t: N('Mruganie diodą', 'Blink an LED'), d: N('Zwykłe wyjście cyfrowe: 3,3 V albo 0 V. Dioda LED zawsze potrzebuje rezystora 220 Ω.', 'A plain digital output: 3.3 V or 0 V. An LED always needs a 220 Ω resistor.'), w: N('GPIO5 → rezystor 220 Ω → anoda LED, katoda → GND', 'GPIO5 → 220 Ω resistor → LED anode, cathode → GND'),
        code: 'const int LED = 5;\n\nvoid setup() {\n  pinMode(LED, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED, HIGH);\n  delay(500);\n  digitalWrite(LED, LOW);\n  delay(500);\n}\n' },
      { k: 'dig', t: N('Przycisk BOOT jako wejście', 'BOOT button as an input'), d: N('Przycisk BOOT jest podłączony do GPIO0 i po starcie możesz go używać jak zwykłego przycisku. Wciśnięty daje LOW.', 'The BOOT button is wired to GPIO0 and after startup you can use it as a normal button. Pressed reads LOW.'), w: N('Nic nie podłączasz, przycisk jest na płytce', 'Nothing to wire, the button is on the board'),
        code: R`const int BTN = 0;

void setup() {
  Serial.begin(115200);
  pinMode(BTN, INPUT_PULLUP);
}

void loop() {
  Serial.println(digitalRead(BTN) == LOW ? "pressed" : "released");
  delay(100);
}
` },
      { k: 'dig', t: N('Dioda RGB na płytce', 'On-board RGB LED'), d: N('Dioda WS2812 jest sterowana jednym pinem. neopixelWrite przyjmuje numer pinu i składowe czerwoną, zieloną i niebieską w zakresie 0 do 255. Na płytce v1.0 zmień pin na 48.', 'The WS2812 LED is driven from a single pin. neopixelWrite takes the pin number and red, green and blue values from 0 to 255. On a v1.0 board change the pin to 48.'), w: N('Nic nie podłączasz, dioda jest na płytce', 'Nothing to wire, the LED is on the board'),
        code: R`const int RGB_PIN = 38;

void setup() {
}

void loop() {
  neopixelWrite(RGB_PIN, 32, 0, 0);
  delay(400);
  neopixelWrite(RGB_PIN, 0, 32, 0);
  delay(400);
  neopixelWrite(RGB_PIN, 0, 0, 32);
  delay(400);
}
` },
      { k: 'ana', t: N('Potencjometr i napięcie', 'Potentiometer and voltage'), d: N('GPIO1 to ADC1, który działa razem z Wi-Fi. analogReadMilliVolts zwraca napięcie po fabrycznej kalibracji.', 'GPIO1 is ADC1, which works alongside Wi-Fi. analogReadMilliVolts returns the voltage after factory calibration.'), w: N('Środek potencjometru → GPIO1, skrajne → 3V3 i GND', 'Potentiometer wiper → GPIO1, outer legs → 3V3 and GND'),
        code: R`const int POT = 1;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
}

void loop() {
  int raw = analogRead(POT);
  int mv = analogReadMilliVolts(POT);
  Serial.printf("raw %d  %d mV\n", raw, mv);
  delay(200);
}
` },
      { k: 'ana', t: N('Płynne rozjaśnianie (PWM)', 'Smooth fade (PWM)'), d: N('ledcAttach przypina pin do kanału LEDC z podaną częstotliwością i rozdzielczością, ledcWrite ustawia wypełnienie. Tu 10 bitów, czyli 0 do 1023.', 'ledcAttach attaches a pin to an LEDC channel with the given frequency and resolution, ledcWrite sets the duty. Here 10 bits, so 0 to 1023.'), w: N('GPIO4 → rezystor 220 Ω → anoda LED, katoda → GND', 'GPIO4 → 220 Ω resistor → LED anode, cathode → GND'),
        code: R`const int LED = 4;

void setup() {
  ledcAttach(LED, 5000, 10);
}

void loop() {
  for (int d = 0; d <= 1023; d += 4) {
    ledcWrite(LED, d);
    delay(4);
  }
  for (int d = 1023; d >= 0; d -= 4) {
    ledcWrite(LED, d);
    delay(4);
  }
}
` },
      { k: 'ana', t: N('Przycisk dotykowy', 'Touch button'), d: N('W ESP32-S3 odczyt rośnie, gdy dotykasz pinu. Dobierz próg doświadczalnie.', 'On the ESP32-S3 the reading rises when you touch the pin. Pick the threshold by experiment.'), w: N('GPIO5 → kawałek przewodu lub folia miedziana', 'GPIO5 → a bare wire or copper foil pad'),
        code: R`void setup() {
  Serial.begin(115200);
}

void loop() {
  Serial.println(touchRead(5));
  delay(200);
}
` },
      { k: 'bus', t: N('Skaner I²C', 'I²C scanner'), d: N('Wypisuje adresy urządzeń na magistrali. Piny 8 i 9 to domyślne SDA i SCL w rdzeniu Arduino.', 'Prints the addresses of devices on the bus. Pins 8 and 9 are the default SDA and SCL in the Arduino core.'), w: N('GPIO8 → SDA, GPIO9 → SCL, zasilanie 3V3 i GND', 'GPIO8 → SDA, GPIO9 → SCL, power 3V3 and GND'),
        code: R`#include <Wire.h>

void setup() {
  Serial.begin(115200);
  Wire.begin(8, 9);
}

void loop() {
  for (byte a = 1; a < 127; a++) {
    Wire.beginTransmission(a);
    if (Wire.endTransmission() == 0) Serial.printf("found 0x%02X\n", a);
  }
  delay(2000);
}
` }
    ],
    ide: {
      url: 'https://espressif.github.io/arduino-esp32/package_esp32_index.json',
      rows: [
        ['Board', 'ESP32S3 Dev Module', N('Z pakietu „esp32 by Espressif Systems”.', 'From the package “esp32 by Espressif Systems”.')],
        ['USB CDC On Boot', 'Enabled', N('Włącz, gdy korzystasz z portu USB (natywnego) i chcesz widzieć Serial w monitorze. Przy porcie UART zostaw Disabled.', 'Enable when you use the native USB port and want Serial in the monitor. With the UART port leave it Disabled.')],
        ['CPU Frequency', '240MHz (WiFi)', N('Pełna prędkość.', 'Full speed.')],
        ['Flash Mode', 'QIO 80MHz', N('Dla płytek z flashem 8 MB (N8, N8R8). Warianty z octal flash wymagają OPI.', 'For boards with 8 MB flash (N8, N8R8). Octal flash variants need OPI.')],
        ['Flash Size', '8MB (64Mb)', N('Dopasuj do modułu: N8 to 8 MB, N16 to 16 MB.', 'Match your module: N8 is 8 MB, N16 is 16 MB.')],
        ['Partition Scheme', '8M with spiffs (3MB APP/1.5MB SPIFFS)', N('Podział dla 8 MB flasha. Przy 16 MB wybierz schemat 16M.', 'The layout for 8 MB flash. With 16 MB choose a 16M scheme.')],
        ['PSRAM', 'OPI PSRAM', N('Dla wariantu R8 (octal PSRAM, np. N8R8). Bez PSRAM wybierz Disabled.', 'For the R8 variant (octal PSRAM, e.g. N8R8). Without PSRAM choose Disabled.')],
        ['Upload Mode', 'UART0 / Hardware CDC', N('Domyślny tryb, działa z obu portów.', 'The default mode, works from both ports.')],
        ['Upload Speed', '921600', N('Szybko i zwykle stabilnie. Przy błędach zejdź do 460800 lub 115200.', 'Fast and usually stable. If uploads fail, drop to 460800 or 115200.')],
        ['USB Mode', 'Hardware CDC and JTAG', N('Domyślny tryb. USB-OTG (TinyUSB) wybierz, gdy płytka ma być klawiaturą, myszą lub dyskiem.', 'The default mode. Choose USB-OTG (TinyUSB) when the board should act as a keyboard, mouse or drive.')],
        ['Core Debug Level', 'None', N('Wyższe poziomy dopisują logi do konsoli.', 'Higher levels add logs to the console.')],
        ['Port', 'COMx / /dev/ttyACMx', N('Port UART (CP2102N) pojawia się jako ttyUSB, natywny USB zwykle jako ttyACM.', 'The UART port (CP2102N) shows up as ttyUSB, native USB usually as ttyACM.')]
      ],
      steps: [
        N('W File → Preferences wklej adres z góry do pola Additional boards manager URLs.', 'In File → Preferences paste the URL above into Additional boards manager URLs.'),
        N('Otwórz Boards Manager, wyszukaj esp32 i zainstaluj „esp32 by Espressif Systems”.', 'Open Boards Manager, search for esp32 and install “esp32 by Espressif Systems”.'),
        N('W Tools → Board → esp32 wybierz ESP32S3 Dev Module.', 'In Tools → Board → esp32 choose ESP32S3 Dev Module.'),
        N('Podłącz kabel do portu oznaczonego UART (najłatwiejszy start) albo USB, a następnie ustaw USB CDC On Boot według tabeli.', 'Plug the cable into the port marked UART (easiest start) or USB, then set USB CDC On Boot as in the table.'),
        N('Ustaw PSRAM i Flash Size zgodnie z napisem na module, na przykład N8R8 to 8 MB flasha i octal PSRAM.', 'Set PSRAM and Flash Size to match the label on the module, for example N8R8 is 8 MB flash with octal PSRAM.'),
        N('W Tools → Port wybierz port i kliknij Upload.', 'In Tools → Port pick the port and click Upload.'),
        N('Serial Monitor ustaw na 115200 baud, czyli tyle, ile w Serial.begin.', 'Set Serial Monitor to 115200 baud, matching Serial.begin.')
      ],
      tips: [
        N('Port nie pojawia się albo wgrywanie się nie zaczyna: przytrzymaj BOOT, naciśnij RST i puść BOOT. Płytka wchodzi w tryb flashowania i dostaje nowy port.', 'No port, or the upload never starts: hold BOOT, press RST and release BOOT. The board enters download mode and gets a new port.'),
        N('Serial milczy na porcie USB: sprawdź, czy USB CDC On Boot jest Enabled. Po zmianie tej opcji wgraj program ponownie.', 'Serial is silent on the USB port: check that USB CDC On Boot is Enabled. Re-upload after changing the option.'),
        N('Płytka restartuje się w kółko po włączeniu PSRAM: wariant modułu nie ma octal PSRAM. Ustaw PSRAM na Disabled.', 'Board reboots in a loop after enabling PSRAM: the module variant has no octal PSRAM. Set PSRAM to Disabled.'),
        N('Wgrywanie urywa się w połowie: zmniejsz Upload Speed do 460800 albo 115200.', 'Upload cuts out halfway: lower Upload Speed to 460800 or 115200.')
      ]
    }
  });

  var C3 = {
    0: ['ADC1_0 · 32K_P', 'adc', ['dig', 'adc', 'pwm'], N('ADC1 działa razem z Wi-Fi.', 'ADC1 works alongside Wi-Fi.')],
    1: ['ADC1_1 · 32K_N', 'adc', ['dig', 'adc', 'pwm'], N('ADC1 działa razem z Wi-Fi.', 'ADC1 works alongside Wi-Fi.')],
    2: ['ADC1_2', 'sys', ['dig', 'adc', 'pwm', 'strap'], N('ADC1 działa razem z Wi-Fi.', 'ADC1 works alongside Wi-Fi.'), N('Pin startowy: zostaw niepodłączony albo HIGH przy resecie.', 'Strapping pin: leave floating or HIGH at reset.')],
    3: ['ADC1_3', 'adc', ['dig', 'adc', 'pwm'], N('ADC1 działa razem z Wi-Fi.', 'ADC1 works alongside Wi-Fi.')],
    4: ['ADC1_4 · SCK', 'com', ['dig', 'adc', 'pwm', 'spi'], N('Domyślny SCK magistrali SPI w rdzeniu Arduino. Także JTAG (MTMS).', 'Default clock of the SPI bus in the Arduino core. Also JTAG (MTMS).')],
    5: ['ADC2_0 · MISO', 'com', ['dig', 'adc', 'pwm', 'spi'], N('Domyślny MISO magistrali SPI. ' + T_ADC2[0], 'Default MISO of the SPI bus. ' + T_ADC2[1])],
    6: ['MOSI', 'com', ['dig', 'pwm', 'spi'], N('Domyślny MOSI magistrali SPI.', 'Default MOSI of the SPI bus.')],
    7: ['SS', 'com', ['dig', 'pwm', 'spi'], N('Domyślny CS magistrali SPI.', 'Default chip select of the SPI bus.')],
    8: ['RGB LED · SDA', 'sys', ['dig', 'pwm', 'i2c', 'strap', 'led'], N('Adresowalna dioda RGB WS2812 na płytce. W rdzeniu Arduino to też domyślny SDA.', 'The addressable WS2812 RGB LED on the board. In the Arduino core it is also the default SDA.'), N('Pin startowy: nie wymuszaj LOW przy resecie.', 'Strapping pin: do not force LOW at reset.')],
    9: ['BOOT · SCL', 'sys', ['dig', 'pwm', 'i2c', 'strap'], N('Przycisk BOOT na płytce. W rdzeniu Arduino to też domyślny SCL.', 'The BOOT button on the board. In the Arduino core it is also the default SCL.'), N('LOW przy resecie włącza tryb flashowania. Ma wewnętrzny pull-up.', 'LOW at reset enters download mode. Has an internal pull-up.')],
    10: ['', 'io', ['dig', 'pwm']],
    18: ['USB D-', 'sys', ['dig', 'pwm', 'usb'], N('Linia natywnego USB układu, wyprowadzona na złącze.', 'The chip native USB line, broken out to the header.'), N('Jako GPIO tylko wtedy, gdy nie używasz natywnego USB.', 'Use as GPIO only when you do not use native USB.')],
    19: ['USB D+', 'sys', ['dig', 'pwm', 'usb'], N('Linia natywnego USB układu, wyprowadzona na złącze.', 'The chip native USB line, broken out to the header.'), N('Jako GPIO tylko wtedy, gdy nie używasz natywnego USB.', 'Use as GPIO only when you do not use native USB.')],
    20: ['RX · U0RXD', 'com', ['dig', 'pwm', 'uart'], N('UART0: do mostka USB-UART. Zajęty, gdy używasz Serial.', 'UART0: to the USB-UART bridge. Taken when you use Serial.')],
    21: ['TX · U0TXD', 'com', ['dig', 'pwm', 'uart'], N('UART0: do mostka USB-UART. Zajęty, gdy używasz Serial.', 'UART0: to the USB-UART bridge. Taken when you use Serial.')]
  };

  function c3(n, name) {
    var d = C3[n];
    return P(name || 'IO' + n, d[0], d[1], d[2], d[3], d[4]);
  }

  Pinout.add({
    id: 'esp32-c3',
    family: 'esp32',
    tab: 'ESP32-C3',
    name: N('ESP32-C3-DevKitM-1', 'ESP32-C3-DevKitM-1'),
    pcb: 'esp',
    w: 250, h: 440, r: 16, fs: 12, show: 620,
    pad: { l: 200, r: 200, t: 14, b: 40 },
    holes: [[14, 14], [236, 14], [14, 426], [236, 426]],
    feats: [
      { t: 'mod', x: 62, y: 18, w: 126, h: 150, txt: 'ESP32-C3-MINI-1' },
      { t: 'txt', x: 125, y: 214, txt: 'ESP32-C3-DevKitM-1', big: true },
      { t: 'led', x: 125, y: 252, c: 'rgb', txt: 'GPIO8' },
      { t: 'ic', x: 99, y: 296, w: 52, h: 32, txt: 'USB-UART' },
      { t: 'btn', x: 64, y: 372, txt: 'BOOT' },
      { t: 'btn', x: 186, y: 372, txt: 'RST' },
      { t: 'usb', x: 95, y: 416, w: 60, h: 30, txt: 'micro-USB' }
    ],
    headers: [
      { x: 17, y: 50, dir: 'v', out: 'l', pins: [gnd(), v33(), v33(), c3(2), c3(3), gnd(), P('RST', 'CHIP_PU', 'sys', ['rst'], N('Reset modułu: LOW restartuje, HIGH (domyślnie) oznacza pracę.', 'Module reset: LOW restarts it, HIGH (default) means running.')), gnd(), c3(0), c3(1), c3(10), gnd(), v5('5V', X5V), v5('5V', X5V), gnd()] },
      { x: 233, y: 50, dir: 'v', out: 'r', pins: [gnd(), c3(21, 'TX'), c3(20, 'RX'), gnd(), c3(9), c3(8), gnd(), c3(7), c3(6), c3(5), c3(4), gnd(), c3(18), c3(19), gnd()] }
    ],
    desc: [
      N('Mała i tania płytka Espressif z układem ESP32-C3: jeden rdzeń RISC-V 160 MHz, Wi-Fi i Bluetooth 5 (LE). Ma 30 pinów (2 rzędy po 15), przyciski BOOT i RST, mostek USB-UART na micro-USB oraz adresowalną diodę RGB na GPIO8.', 'A small, inexpensive Espressif board with the ESP32-C3: a single RISC-V core at 160 MHz, Wi-Fi and Bluetooth 5 (LE). It has 30 pins (two rows of 15), BOOT and RST buttons, a USB-UART bridge on micro-USB and an addressable RGB LED on GPIO8.'),
      N('Użytecznych pinów jest niewiele (GPIO0 do 10, 18 do 21), a kilka z nich to piny startowe. Do prostych czujników, przekaźników i urządzeń na baterię to w zupełności wystarcza.', 'There are few usable pins (GPIO0 to 10, 18 to 21) and several of them are strapping pins. For simple sensors, relays and battery devices that is plenty.')
    ],
    uses: [
      N('Tanie węzły Wi-Fi i BLE: czujniki, włączniki, liczniki, które mają działać latami.', 'Cheap Wi-Fi and BLE nodes: sensors, switches and meters that should run for years.'),
      N('Urządzenia na baterii dzięki trybom głębokiego uśpienia i niskiemu poborowi prądu.', 'Battery devices thanks to deep sleep modes and low current draw.'),
      N('Ledy adresowalne i efekty świetlne: dioda RGB na płytce nadaje się na wskaźnik stanu.', 'Addressable LEDs and light effects: the on-board RGB LED works as a status indicator.'),
      N('Zamiennik ESP8266 w starych projektach, z nowszym Wi-Fi i Bluetoothem.', 'A drop-in upgrade for ESP8266 projects, with newer Wi-Fi and Bluetooth.'),
      N('Nauka pracy z architekturą RISC-V.', 'Learning the RISC-V architecture.')
    ],
    specs: [
      ['Moduł', 'Module', 'ESP32-C3-MINI-1'],
      ['Procesor', 'CPU', N('1 rdzeń RISC-V, do 160 MHz', '1 RISC-V core, up to 160 MHz')],
      ['Łączność', 'Wireless', N('Wi-Fi 802.11 b/g/n i Bluetooth 5 (LE)', 'Wi-Fi 802.11 b/g/n and Bluetooth 5 (LE)')],
      ['Pamięć', 'Memory', N('400 KB SRAM, flash 4 MB', '400 KB SRAM, 4 MB flash')],
      ['Poziom logiczny', 'Logic level', N('3,3 V, piny nie są odporne na 5 V', '3.3 V, pins are not 5 V tolerant')],
      ['ADC', 'ADC', N('12 bit, 6 kanałów (ADC1: GPIO0 do 4, ADC2: GPIO5)', '12-bit, 6 channels (ADC1: GPIO0 to 4, ADC2: GPIO5)')],
      ['DAC i dotyk', 'DAC and touch', N('brak', 'none')],
      ['USB', 'USB', N('Micro-USB, mostek USB-UART; natywne USB na GPIO18 i GPIO19', 'Micro-USB, USB-UART bridge; native USB on GPIO18 and GPIO19')],
      ['Dioda RGB', 'RGB LED', N('WS2812 na GPIO8', 'WS2812 on GPIO8')],
      ['Zasilanie', 'Power', N('5 V z USB albo piny 5V, regulator 3,3 V na płytce', '5 V from USB or the 5V pins, 3.3 V regulator on board')]
    ],
    ex: [
      { k: 'dig', t: N('Mruganie diodą', 'Blink an LED'), d: N('Zwykłe wyjście cyfrowe: 3,3 V albo 0 V. Dioda LED zawsze potrzebuje rezystora 220 Ω.', 'A plain digital output: 3.3 V or 0 V. An LED always needs a 220 Ω resistor.'), w: N('GPIO10 → rezystor 220 Ω → anoda LED, katoda → GND', 'GPIO10 → 220 Ω resistor → LED anode, cathode → GND'),
        code: 'const int LED = 10;\n\nvoid setup() {\n  pinMode(LED, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED, HIGH);\n  delay(500);\n  digitalWrite(LED, LOW);\n  delay(500);\n}\n' },
      { k: 'dig', t: N('Przycisk BOOT jako wejście', 'BOOT button as an input'), d: N('Przycisk BOOT jest podłączony do GPIO9. Po starcie możesz go używać jak zwykłego przycisku. Wciśnięty daje LOW.', 'The BOOT button is wired to GPIO9. After startup you can use it as a normal button. Pressed reads LOW.'), w: N('Nic nie podłączasz, przycisk jest na płytce', 'Nothing to wire, the button is on the board'),
        code: R`const int BTN = 9;

void setup() {
  Serial.begin(115200);
  pinMode(BTN, INPUT_PULLUP);
}

void loop() {
  Serial.println(digitalRead(BTN) == LOW ? "pressed" : "released");
  delay(100);
}
` },
      { k: 'dig', t: N('Dioda RGB na płytce', 'On-board RGB LED'), d: N('Dioda WS2812 siedzi na GPIO8 i jest sterowana jednym pinem. neopixelWrite przyjmuje numer pinu i składowe czerwoną, zieloną i niebieską w zakresie 0 do 255.', 'The WS2812 LED sits on GPIO8 and is driven from a single pin. neopixelWrite takes the pin number and red, green and blue values from 0 to 255.'), w: N('Nic nie podłączasz, dioda jest na płytce', 'Nothing to wire, the LED is on the board'),
        code: R`const int RGB_PIN = 8;

void setup() {
}

void loop() {
  neopixelWrite(RGB_PIN, 32, 0, 0);
  delay(400);
  neopixelWrite(RGB_PIN, 0, 32, 0);
  delay(400);
  neopixelWrite(RGB_PIN, 0, 0, 32);
  delay(400);
}
` },
      { k: 'ana', t: N('Potencjometr i napięcie', 'Potentiometer and voltage'), d: N('GPIO0 to ADC1, który działa razem z Wi-Fi. analogReadMilliVolts zwraca napięcie po fabrycznej kalibracji.', 'GPIO0 is ADC1, which works alongside Wi-Fi. analogReadMilliVolts returns the voltage after factory calibration.'), w: N('Środek potencjometru → GPIO0, skrajne → 3V3 i GND', 'Potentiometer wiper → GPIO0, outer legs → 3V3 and GND'),
        code: R`const int POT = 0;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
}

void loop() {
  int raw = analogRead(POT);
  int mv = analogReadMilliVolts(POT);
  Serial.printf("raw %d  %d mV\n", raw, mv);
  delay(200);
}
` },
      { k: 'ana', t: N('Płynne rozjaśnianie (PWM)', 'Smooth fade (PWM)'), d: N('ledcAttach przypina pin do kanału LEDC, ledcWrite ustawia wypełnienie. Układ ma 6 kanałów PWM.', 'ledcAttach attaches a pin to an LEDC channel and ledcWrite sets the duty. The chip has 6 PWM channels.'), w: N('GPIO3 → rezystor 220 Ω → anoda LED, katoda → GND', 'GPIO3 → 220 Ω resistor → LED anode, cathode → GND'),
        code: R`const int LED = 3;

void setup() {
  ledcAttach(LED, 5000, 8);
}

void loop() {
  for (int d = 0; d <= 255; d++) {
    ledcWrite(LED, d);
    delay(5);
  }
  for (int d = 255; d >= 0; d--) {
    ledcWrite(LED, d);
    delay(5);
  }
}
` },
      { k: 'bus', t: N('Skaner I²C', 'I²C scanner'), d: N('Piny I²C wybierasz w Wire.begin. Tu GPIO6 i GPIO7, bo domyślne 8 i 9 zajmują dioda RGB i przycisk BOOT.', 'You choose the I²C pins in Wire.begin. Here GPIO6 and GPIO7, because the defaults 8 and 9 are taken by the RGB LED and the BOOT button.'), w: N('GPIO6 → SDA, GPIO7 → SCL, zasilanie 3V3 i GND', 'GPIO6 → SDA, GPIO7 → SCL, power 3V3 and GND'),
        code: R`#include <Wire.h>

void setup() {
  Serial.begin(115200);
  Wire.begin(6, 7);
}

void loop() {
  for (byte a = 1; a < 127; a++) {
    Wire.beginTransmission(a);
    if (Wire.endTransmission() == 0) Serial.printf("found 0x%02X\n", a);
  }
  delay(2000);
}
` }
    ],
    ide: {
      url: 'https://espressif.github.io/arduino-esp32/package_esp32_index.json',
      rows: [
        ['Board', 'ESP32C3 Dev Module', N('Z pakietu „esp32 by Espressif Systems”.', 'From the package “esp32 by Espressif Systems”.')],
        ['USB CDC On Boot', 'Disabled', N('Płytka używa mostka USB-UART, więc Serial idzie przez UART0. Enabled ustaw tylko, gdy używasz natywnego USB na GPIO18 i GPIO19.', 'The board uses a USB-UART bridge, so Serial goes over UART0. Set Enabled only when you use native USB on GPIO18 and GPIO19.')],
        ['CPU Frequency', '160MHz (WiFi)', N('Maksymalna prędkość tego układu.', 'The maximum speed of this chip.')],
        ['Flash Frequency', '80MHz', N('Standard dla modułu MINI-1.', 'Standard for the MINI-1 module.')],
        ['Flash Mode', 'QIO', N('Moduł ESP32-C3-MINI-1 ma flash quad, więc QIO jest właściwe.', 'The ESP32-C3-MINI-1 module has quad flash, so QIO is right.')],
        ['Flash Size', '4MB (32Mb)', N('Zgodnie z modułem.', 'Matches the module.')],
        ['Partition Scheme', 'Default 4MB with spiffs (1.2MB APP/1.5MB SPIFFS)', N('Domyślny podział na aplikację i system plików.', 'The default split between app and file system.')],
        ['Upload Speed', '921600', N('Szybko i zwykle stabilnie. Przy błędach zejdź do 460800 lub 115200.', 'Fast and usually stable. If uploads fail, drop to 460800 or 115200.')],
        ['Core Debug Level', 'None', N('Wyższe poziomy dopisują logi do konsoli.', 'Higher levels add logs to the console.')],
        ['Erase All Flash Before Sketch Upload', 'Disabled', N('Włącz raz, gdy chcesz wyczyścić zapisane hasła Wi-Fi i pamięć NVS.', 'Turn on once when you want to wipe saved Wi-Fi credentials and NVS storage.')],
        ['Port', 'COMx / /dev/ttyUSBx', N('Pojawia się po podłączeniu płytki.', 'Shows up once the board is plugged in.')]
      ],
      steps: [
        N('W File → Preferences wklej adres z góry do pola Additional boards manager URLs.', 'In File → Preferences paste the URL above into Additional boards manager URLs.'),
        N('Otwórz Boards Manager, wyszukaj esp32 i zainstaluj „esp32 by Espressif Systems”.', 'Open Boards Manager, search for esp32 and install “esp32 by Espressif Systems”.'),
        N('W Tools → Board → esp32 wybierz ESP32C3 Dev Module.', 'In Tools → Board → esp32 choose ESP32C3 Dev Module.'),
        N('Podłącz kabel micro-USB z liniami danych i wybierz port w Tools → Port.', 'Plug in a micro-USB cable that carries data and pick the port in Tools → Port.'),
        N('Kliknij Upload. Gdy łączenie się nie udaje, przytrzymaj BOOT, naciśnij RST i puść BOOT.', 'Click Upload. If connecting fails, hold BOOT, press RST and release BOOT.'),
        N('Serial Monitor ustaw na 115200 baud, czyli tyle, ile w Serial.begin.', 'Set Serial Monitor to 115200 baud, matching Serial.begin.')
      ],
      tips: [
        N('Wgrywanie się nie zaczyna: wejdź w tryb flashowania ręcznie (BOOT + RST) i spróbuj ponownie.', 'The upload does not start: enter download mode by hand (BOOT + RST) and try again.'),
        N('Płytka nie startuje po dołączeniu czegoś do GPIO2, GPIO8 lub GPIO9: to piny startowe, odłącz je na czas resetu.', 'Board does not boot after wiring something to GPIO2, GPIO8 or GPIO9: those are strapping pins, disconnect them during reset.'),
        N('Wgrywanie urywa się w połowie: zmniejsz Upload Speed do 460800 albo 115200.', 'Upload cuts out halfway: lower Upload Speed to 460800 or 115200.'),
        N('Serial milczy: baud musi się zgadzać z Serial.begin, a USB CDC On Boot zostaw Disabled przy porcie z mostkiem.', 'Serial is silent: the baud must match Serial.begin, and keep USB CDC On Boot Disabled on the bridge port.')
      ]
    }
  });
})();
