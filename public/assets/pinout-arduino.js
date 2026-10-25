(function () {
  'use strict';

  var P = Pinout.p;
  var R = String.raw;
  var N = function (pl, en) { return [pl, en]; };

  var W_UART = N('Odłącz urządzenia od D0 i D1 na czas wgrywania programu.', 'Disconnect devices from D0 and D1 while uploading.');
  var X_UART = N('Sprzętowy UART (Serial), wspólny z USB.', 'Hardware UART (Serial), shared with USB.');
  var PWM490 = N('PWM 490 Hz (analogWrite).', 'PWM at 490 Hz (analogWrite).');
  var PWM980 = N('PWM 980 Hz (analogWrite).', 'PWM at 980 Hz (analogWrite).');

  var UD = {
    0: ['RX', 'com', ['dig', 'uart'], X_UART, W_UART],
    1: ['TX', 'com', ['dig', 'uart'], X_UART, W_UART],
    2: ['INT0', 'io', ['dig', 'int'], N('Wejście przerwania zewnętrznego INT0.', 'External interrupt input INT0.')],
    3: ['PWM · INT1', 'io', ['dig', 'pwm', 'int'], N('PWM 490 Hz i wejście przerwania INT1.', 'PWM at 490 Hz and interrupt input INT1.')],
    4: ['', 'io', ['dig']],
    5: ['PWM', 'io', ['dig', 'pwm'], PWM980],
    6: ['PWM', 'io', ['dig', 'pwm'], PWM980],
    7: ['', 'io', ['dig']],
    8: ['', 'io', ['dig']],
    9: ['PWM', 'io', ['dig', 'pwm'], PWM490],
    10: ['PWM · SS', 'com', ['dig', 'pwm', 'spi'], N('PWM 490 Hz. Linia CS magistrali SPI.', 'PWM at 490 Hz. Chip select of the SPI bus.')],
    11: ['PWM · MOSI', 'com', ['dig', 'pwm', 'spi'], N('PWM 490 Hz. Linia MOSI magistrali SPI.', 'PWM at 490 Hz. MOSI line of the SPI bus.')],
    12: ['MISO', 'com', ['dig', 'spi'], N('Linia MISO magistrali SPI.', 'MISO line of the SPI bus.')],
    13: ['SCK · LED', 'com', ['dig', 'spi', 'led'], N('Linia SCK magistrali SPI i dioda LED_BUILTIN.', 'The SCK line of the SPI bus and the LED_BUILTIN LED.'), N('Dioda jest też podłączona do tego pinu, więc przy wejściu cyfrowym lekko zaniża napięcie.', 'The LED is wired to this pin too, so as a digital input it pulls the level down slightly.')]
  };

  function ud(n) {
    var d = UD[n];
    return P('D' + n, d[0], d[1], d[2], d[3], d[4]);
  }

  function ua(n) {
    var s = 'D' + (14 + n);
    if (n === 4) return P('A4', s + ' · SDA', 'com', ['dig', 'adc', 'i2c'], N('Wejście analogowe (10 bit) i linia SDA magistrali I²C.', 'Analog input (10-bit) and the SDA line of the I²C bus.'));
    if (n === 5) return P('A5', s + ' · SCL', 'com', ['dig', 'adc', 'i2c'], N('Wejście analogowe (10 bit) i linia SCL magistrali I²C.', 'Analog input (10-bit) and the SCL line of the I²C bus.'));
    return P('A' + n, s, 'adc', ['dig', 'adc'], N('Wejście analogowe 10 bit (0 do 1023). Działa też jako zwykły pin cyfrowy.', '10-bit analog input (0 to 1023). Also works as a plain digital pin.'));
  }

  function ua67(n) {
    return P('A' + n, '', 'adc', ['adc'], N('Tylko wejście analogowe. Nie działa jako pin cyfrowy ani wyjście.', 'Analog input only. Does not work as a digital pin or an output.'));
  }

  function gnd() { return P('GND', '', 'gnd', ['pwr'], N('Masa. Wspólna dla wszystkich układów w projekcie.', 'Ground. Common to every part in your project.')); }
  function v5(x) { return P('5V', '', 'pwr', ['pwr'], x || N('Stabilizowane 5 V. Zasila czujniki i diody. Dopuszczalny prąd zależy od zasilania.', 'Regulated 5 V. Powers sensors and LEDs. The available current depends on the supply.')); }
  function v33(x) { return P('3V3', '', 'pwr', ['pwr'], x); }
  function vin(x) { return P('VIN', '', 'pwr', ['pwr'], x); }
  function reset() { return P('RESET', '', 'sys', ['rst'], N('LOW resetuje mikrokontroler.', 'LOW resets the microcontroller.')); }
  function aref() {
    return P('AREF', '', 'sys', [], N('Napięcie odniesienia przetwornika ADC. Zwykle zostaw niepodłączone.', 'Reference voltage of the ADC. Usually leave unconnected.'), N('Nie podawaj napięcia na AREF bez analogReference(EXTERNAL) w programie, bo zewrzesz wewnętrzne źródło.', 'Never feed a voltage to AREF without analogReference(EXTERNAL) in your sketch, or you short the internal source.'));
  }
  function i2cPin(n, a) { return P(n, a, 'com', ['i2c'], N('Ta sama linia I²C, co ' + a + ' (wyprowadzona drugi raz dla shieldów).', 'The same I²C line as ' + a + ' (broken out a second time for shields).')); }

  var UNO_5V = N('Stabilizowane 5 V z regulatora lub USB. Prąd zależy od zasilania (z USB do ok. 500 mA).', 'Regulated 5 V from the regulator or USB. Current depends on the supply (up to about 500 mA from USB).');
  var UNO_VIN = N('Wejście zasilania, zalecane 7 do 12 V. To ten sam punkt, co gniazdo DC.', 'Power input, 7 to 12 V recommended. The same node as the DC jack.');
  var UNO_3V3 = N('Wyjście 3,3 V z regulatora, do ok. 50 mA.', '3.3 V output from the regulator, up to about 50 mA.');

  var UNO_COMMON_IDE_TIPS = [
    N('Błąd „avrdude: stk500_getsync()” albo „not in sync”: zły port, zła płytka albo zły bootloader. Sprawdź Tools → Board, Processor i Port.', 'Error “avrdude: stk500_getsync()” or “not in sync”: wrong port, wrong board or wrong bootloader. Check Tools → Board, Processor and Port.'),
    N('Brak portu na liście: kabel bez linii danych albo brak sterownika. Klony z układem CH340 wymagają sterownika CH340.', 'No port in the list: a charge-only cable or a missing driver. Clones with a CH340 chip need the CH340 driver.'),
    N('Wgrywanie nie działa, gdy coś jest podłączone do D0 lub D1: odłącz je na czas wgrywania.', 'Upload fails while something is wired to D0 or D1: unplug it for the upload.'),
    N('Serial Monitor pokazuje śmieci: baud w prawym dolnym rogu musi być taki sam jak w Serial.begin.', 'Serial Monitor shows garbage: the baud at the bottom right must match Serial.begin.')
  ];

  var I2C_SCAN = R`#include <Wire.h>

void setup() {
  Serial.begin(9600);
  Wire.begin();
}

void loop() {
  for (byte a = 1; a < 127; a++) {
    Wire.beginTransmission(a);
    if (Wire.endTransmission() == 0) {
      Serial.print("found 0x");
      Serial.println(a, HEX);
    }
  }
  delay(2000);
}
`;

  var AVR_SPECS_COMMON = [
    ['Poziom logiczny', 'Logic level', N('5 V', '5 V')],
    ['Prąd pinu', 'Pin current', N('zalecane do 20 mA, absolutne maksimum 40 mA', '20 mA recommended, 40 mA absolute max')],
    ['ADC', 'ADC', N('10 bit (0 do 1023)', '10-bit (0 to 1023)')]
  ];

  function unoEx(potPin, ledPin, tmpPin, i2cWire) {
    return [
      { k: 'dig', t: N('Mruganie diodą', 'Blink an LED'), d: N('LED_BUILTIN to wbudowana dioda na pinie 13. Wyjście cyfrowe daje 5 V albo 0 V.', 'LED_BUILTIN is the on-board LED on pin 13. A digital output gives 5 V or 0 V.'), w: N('Nic nie podłączasz, dioda jest na płytce', 'Nothing to wire, the LED is on the board'),
        code: 'void setup() {\n  pinMode(LED_BUILTIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_BUILTIN, HIGH);\n  delay(500);\n  digitalWrite(LED_BUILTIN, LOW);\n  delay(500);\n}\n' },
      { k: 'dig', t: N('Przycisk z pull-upem', 'Button with pull-up'), d: N('INPUT_PULLUP włącza wewnętrzny rezystor, więc przycisk łączysz tylko z masą. Wciśnięty daje LOW, więc dioda świeci przy wciśnięciu.', 'INPUT_PULLUP turns on an internal resistor, so the button only goes to ground. Pressed reads LOW, so the LED lights while pressed.'), w: N('D2 → przycisk → GND', 'D2 → button → GND'),
        code: R`const int BTN = 2;

void setup() {
  pinMode(BTN, INPUT_PULLUP);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, digitalRead(BTN) == LOW);
}
` },
      { k: 'ana', t: N('Potencjometr i napięcie', 'Potentiometer and voltage'), d: N('analogRead zwraca 0 do 1023, co odpowiada 0 do 5 V. Przeliczenie na wolty to mnożenie przez 5,0 i dzielenie przez 1023.', 'analogRead returns 0 to 1023, which maps to 0 to 5 V. Converting to volts means multiplying by 5.0 and dividing by 1023.'), w: N('Środek potencjometru → ' + potPin + ', skrajne → 5V i GND', 'Potentiometer wiper → ' + potPin + ', outer legs → 5V and GND'),
        code: 'const int POT = ' + potPin + ';\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int raw = analogRead(POT);\n  float volts = raw * 5.0 / 1023.0;\n  Serial.print(raw);\n  Serial.print("  ");\n  Serial.print(volts);\n  Serial.println(" V");\n  delay(200);\n}\n' },
      { k: 'ana', t: N('Jasność diody z potencjometru (PWM)', 'LED brightness from a potentiometer (PWM)'), d: N('analogWrite generuje PWM 0 do 255 tylko na pinach oznaczonych tyldą. map przelicza zakres 0 do 1023 na 0 do 255.', 'analogWrite generates PWM from 0 to 255 only on pins marked with a tilde. map converts the 0 to 1023 range to 0 to 255.'), w: N(potPin + ' → środek potencjometru, ' + ledPin + ' → rezystor 220 Ω → anoda LED, katoda → GND', potPin + ' → potentiometer wiper, ' + ledPin + ' → 220 Ω resistor → LED anode, cathode → GND'),
        code: 'const int POT = ' + potPin + ';\nconst int LED = ' + ledPin + ';\n\nvoid setup() {\n  pinMode(LED, OUTPUT);\n}\n\nvoid loop() {\n  int v = analogRead(POT);\n  analogWrite(LED, map(v, 0, 1023, 0, 255));\n}\n' },
      { k: 'ana', t: N('Czujnik temperatury TMP36', 'TMP36 temperature sensor'), d: N('TMP36 daje 0,5 V przy 0 °C i 10 mV na każdy stopień. Wzór: (napięcie minus 0,5) razy 100.', 'The TMP36 gives 0.5 V at 0 °C and 10 mV per degree. Formula: (voltage minus 0.5) times 100.'), w: N('TMP36: lewa nóżka → 5V, środkowa → ' + tmpPin + ', prawa → GND (płaską stroną do siebie)', 'TMP36: left leg → 5V, middle → ' + tmpPin + ', right leg → GND (flat side facing you)'),
        code: 'const int TMP = ' + tmpPin + ';\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  float volts = analogRead(TMP) * 5.0 / 1023.0;\n  float celsius = (volts - 0.5) * 100.0;\n  Serial.print(celsius);\n  Serial.println(" C");\n  delay(500);\n}\n' },
      { k: 'bus', t: N('Skaner I²C', 'I²C scanner'), d: N('Wypisuje adresy wszystkich urządzeń na magistrali, więc od razu widać, czy czujnik jest dobrze podłączony.', 'Prints the address of every device on the bus, so you immediately see whether a sensor is wired correctly.'), w: i2cWire,
        code: I2C_SCAN }
    ];
  }

  function avrIde(board, processor, speed, speedNote, boardNote, processorNote) {
    var rows = [
      ['Board', board, boardNote],
      ['Processor', processor, processorNote],
      ['Port', 'COMx / /dev/ttyUSBx / /dev/ttyACMx', N('Pojawia się po podłączeniu płytki. Oryginały dają ttyACM, klony z CH340 ttyUSB.', 'Shows up once the board is plugged in. Originals give ttyACM, CH340 clones ttyUSB.')],
      ['Programmer', 'AVRISP mkII', N('Nie ma znaczenia przy zwykłym wgrywaniu przez USB. Liczy się tylko przy Burn Bootloader.', 'Irrelevant for normal USB uploads. It matters only for Burn Bootloader.')],
      ['Upload speed', speed, speedNote]
    ];
    if (!processor) rows.splice(1, 1);
    return rows;
  }

  Pinout.add({
    id: 'uno',
    family: 'arduino',
    tab: 'Uno',
    name: N('Arduino Uno R3', 'Arduino Uno R3'),
    pcb: 'teal',
    w: 648, h: 420, r: 14, fs: 13, show: 860, min: 700,
    pad: { l: 50, r: 30, t: 120, b: 120 },
    feats: [
      { t: 'usb', x: -22, y: 60, w: 92, h: 84, txt: 'USB-B' },
      { t: 'jack', x: -22, y: 262, w: 82, h: 74, txt: 'DC' },
      { t: 'btn', x: 136, y: 70, txt: 'RESET' },
      { t: 'ic', x: 130, y: 226, w: 64, h: 40, txt: '16U2' },
      { t: 'ic', x: 300, y: 168, w: 200, h: 46, txt: 'ATmega328P' },
      { t: 'ic', x: 214, y: 306, w: 40, h: 16, txt: '16M' },
      { t: 'led', x: 338, y: 74, c: 'orange', txt: 'L' },
      { t: 'hdr', x: 588, y: 198, cols: 3, rows: 2, txt: 'ICSP' },
      { t: 'txt', x: 420, y: 296, txt: 'ARDUINO UNO R3', big: true }
    ],
    headers: [
      { x: 190, y: 26, dir: 'h', out: 't', pins: [i2cPin('SCL', 'A5'), i2cPin('SDA', 'A4'), aref(), gnd(), ud(13), ud(12), ud(11), ud(10), ud(9), ud(8)] },
      { x: 444, y: 26, dir: 'h', out: 't', pins: [ud(7), ud(6), ud(5), ud(4), ud(3), ud(2), ud(1), ud(0)] },
      {
        x: 246, y: 394, dir: 'h', out: 'b', pins: [P('NC', '', 'sys', [], N('Niepodłączony. Zarezerwowany.', 'Not connected. Reserved.')),
          P('IOREF', '', 'sys', [], N('Informuje shieldy o napięciu logicznym płytki (5 V).', 'Tells shields the logic voltage of the board (5 V).')),
          reset(), v33(UNO_3V3), v5(UNO_5V), gnd(), gnd(), vin(UNO_VIN)]
      },
      { x: 452, y: 394, dir: 'h', out: 'b', pins: [ua(0), ua(1), ua(2), ua(3), ua(4), ua(5)] }
    ],
    desc: [
      N('Klasyczna płytka Arduino na ATmega328P. Ma 14 pinów cyfrowych (6 z PWM), 6 wejść analogowych i działa na 5 V. To najlepiej udokumentowana płytka na świecie: większość poradników, bibliotek i shieldów powstała dla niej.', 'The classic Arduino board with an ATmega328P. It has 14 digital pins (6 with PWM), 6 analog inputs and runs at 5 V. It is the best documented board in the world: most tutorials, libraries and shields were written for it.'),
      N('Układ ATmega16U2 obsługuje USB, więc wgrywasz program kablem USB-B bez żadnych dodatków. Dzięki 5 V podłączysz większość czujników i modułów bez konwerterów poziomów.', 'An ATmega16U2 handles USB, so you upload with a USB-B cable and nothing else. At 5 V you can connect most sensors and modules without level shifters.')
    ],
    uses: [
      N('Nauka elektroniki i programowania: diody, przyciski, buzzery, wyświetlacze 7-segmentowe i LCD.', 'Learning electronics and programming: LEDs, buttons, buzzers, 7-segment displays and LCDs.'),
      N('Sterowanie serwami, silnikami krokowymi i przekaźnikami przez gotowe shieldy.', 'Driving servos, stepper motors and relays through ready-made shields.'),
      N('Odczyt czujników analogowych: temperatura, światło, wilgotność gleby, potencjometry.', 'Reading analog sensors: temperature, light, soil moisture, potentiometers.'),
      N('Proste roboty jeżdżące i omijające przeszkody z czujnikiem ultradźwiękowym.', 'Simple wheeled robots and obstacle avoiders with an ultrasonic sensor.'),
      N('Rejestrator danych z kartą SD i zegarem czasu rzeczywistego.', 'A data logger with an SD card and a real-time clock.')
    ],
    specs: [
      ['Mikrokontroler', 'Microcontroller', 'ATmega328P, 16 MHz'],
      ['Pamięć', 'Memory', N('32 KB flash, 2 KB SRAM, 1 KB EEPROM', '32 KB flash, 2 KB SRAM, 1 KB EEPROM')],
      ['Piny cyfrowe', 'Digital pins', N('14 (D0 do D13), w tym 6 z PWM', '14 (D0 to D13), 6 with PWM')],
      ['Piny PWM', 'PWM pins', 'D3, D5, D6, D9, D10, D11'],
      ['Wejścia analogowe', 'Analog inputs', N('6 (A0 do A5), 10 bit', '6 (A0 to A5), 10-bit')],
      ['Przerwania', 'Interrupts', 'D2, D3'],
      ['Magistrale', 'Buses', 'UART D0/D1, I²C A4/A5, SPI D10 do D13'],
      ['Poziom logiczny', 'Logic level', '5 V'],
      ['Prąd pinu', 'Pin current', N('zalecane do 20 mA, absolutne maksimum 40 mA, łącznie ok. 200 mA', '20 mA recommended, 40 mA absolute max, about 200 mA in total')],
      ['Zasilanie', 'Power', N('USB lub gniazdo DC 7 do 12 V (dopuszczalne 6 do 20 V)', 'USB or DC jack 7 to 12 V (6 to 20 V allowed)')]
    ],
    ex: unoEx('A0', '9', 'A1', N('A4 → SDA, A5 → SCL, zasilanie 5V (lub 3V3 dla modułów 3,3 V) i GND', 'A4 → SDA, A5 → SCL, power 5V (or 3V3 for 3.3 V modules) and GND')),
    ide: {
      rows: avrIde('Arduino Uno', null, '115200 (stała)', N('Wynika z bootloadera Optiboot i nie ma osobnej opcji w menu.', 'Comes from the Optiboot bootloader and has no menu option.'), N('Pakiet „Arduino AVR Boards” jest wbudowany w IDE. Nic nie instalujesz.', 'The “Arduino AVR Boards” package is built into the IDE. Nothing to install.')),
      steps: [
        N('Podłącz płytkę kablem USB-B z liniami danych.', 'Plug the board in with a USB-B cable that carries data.'),
        N('W Tools → Board → Arduino AVR Boards wybierz Arduino Uno.', 'In Tools → Board → Arduino AVR Boards choose Arduino Uno.'),
        N('W Tools → Port wybierz port, który pojawił się po podłączeniu.', 'In Tools → Port pick the port that appeared when you plugged in.'),
        N('Kliknij Upload (strzałka w prawo). Dioda TX/RX na płytce mignie podczas wgrywania.', 'Click Upload (the right arrow). The TX/RX LEDs on the board blink during the upload.'),
        N('Serial Monitor (Tools → Serial Monitor) ustaw na tyle baudów, ile w Serial.begin, na przykład 9600.', 'Set Serial Monitor (Tools → Serial Monitor) to the baud in Serial.begin, for example 9600.')
      ],
      tips: UNO_COMMON_IDE_TIPS
    }
  });

  var NANO_5V = N('Wyjście 5 V, gdy płytka jest zasilana z USB lub VIN. Można też podać tu 5 V z zewnątrz.', 'A 5 V output when the board is powered from USB or VIN. You can also feed 5 V in here.');
  var NANO_VIN = N('Wejście zasilania, zalecane 7 do 12 V.', 'Power input, 7 to 12 V recommended.');
  var NANO_3V3 = N('Wyjście 3,3 V, do ok. 50 mA (zależnie od klona).', '3.3 V output, up to about 50 mA (depends on the clone).');

  Pinout.add({
    id: 'nano',
    family: 'arduino',
    tab: 'Nano',
    name: N('Arduino Nano', 'Arduino Nano'),
    pcb: 'teal',
    w: 168, h: 392, r: 10, fs: 12, show: 560,
    pad: { l: 230, r: 230, t: 30, b: 20 },
    feats: [
      { t: 'usb', x: 54, y: -20, w: 60, h: 58, txt: 'mini-USB' },
      { t: 'ic', x: 62, y: 84, w: 44, h: 26, txt: 'USB-UART' },
      { t: 'ic', x: 54, y: 146, w: 60, h: 60, txt: '328P' },
      { t: 'btn', x: 84, y: 262, txt: 'RST' },
      { t: 'hdr', x: 72, y: 322, cols: 3, rows: 2, txt: 'ICSP' },
      { t: 'led', x: 134, y: 74, c: 'orange', txt: 'L' },
      { t: 'txt', x: 84, y: 236, txt: 'NANO', big: true }
    ],
    headers: [
      { x: 12, y: 24, dir: 'v', out: 'l', pins: [ud(13), v33(NANO_3V3), aref(), ua(0), ua(1), ua(2), ua(3), ua(4), ua(5), ua67(6), ua67(7), v5(NANO_5V), reset(), gnd(), vin(NANO_VIN)] },
      { x: 156, y: 24, dir: 'v', out: 'r', pins: [ud(12), ud(11), ud(10), ud(9), ud(8), ud(7), ud(6), ud(5), ud(4), ud(3), ud(2), gnd(), reset(), ud(0), ud(1)] }
    ],
    desc: [
      N('Mała wersja Uno na ATmega328P o rozstawie pinów pasującym do płytki stykowej: 30 pinów w dwóch rzędach, mini-USB i bez gniazda DC. Ma 8 wejść analogowych, o dwa więcej niż Uno, ale A6 i A7 są tylko wejściami analogowymi.', 'A small version of the Uno on an ATmega328P with a pin pitch that fits a breadboard: 30 pins in two rows, mini-USB and no DC jack. It has 8 analog inputs, two more than the Uno, but A6 and A7 are analog-only.'),
      N('Większość tanich Nano to klony z układem CH340 zamiast FT232 i starym bootloaderem. Dlatego w IDE często trzeba wybrać Processor: ATmega328P (Old Bootloader). Rysunek pochodzi z oficjalnego schematu pinów: USB u góry, lewy rząd JP1, prawy JP2.', 'Most cheap Nanos are clones with a CH340 chip instead of an FT232 and an old bootloader. That is why the IDE often needs Processor: ATmega328P (Old Bootloader). The drawing follows the official pinout: USB at the top, JP1 on the left, JP2 on the right.')
    ],
    uses: [
      N('Projekty wlutowane na stałe w urządzenie, gdzie liczy się mały rozmiar.', 'Projects soldered into a device where small size matters.'),
      N('Prototypy na płytce stykowej bez przewodów do zasilania płytki.', 'Breadboard prototypes with no wires needed to power the board.'),
      N('Stacje pogodowe, regulatory, zegary, liczniki i małe roboty.', 'Weather stations, controllers, clocks, counters and small robots.'),
      N('Odczyt czujników analogowych na dwóch dodatkowych wejściach A6 i A7.', 'Reading analog sensors on the two extra inputs, A6 and A7.'),
      N('Sterowanie taśmami LED, serwami i wyświetlaczami OLED przez I²C.', 'Driving LED strips, servos and OLED displays over I²C.')
    ],
    specs: [
      ['Mikrokontroler', 'Microcontroller', 'ATmega328P, 16 MHz'],
      ['Pamięć', 'Memory', N('32 KB flash, 2 KB SRAM, 1 KB EEPROM', '32 KB flash, 2 KB SRAM, 1 KB EEPROM')],
      ['Piny cyfrowe', 'Digital pins', N('14 (D0 do D13), w tym 6 z PWM', '14 (D0 to D13), 6 with PWM')],
      ['Piny PWM', 'PWM pins', 'D3, D5, D6, D9, D10, D11'],
      ['Wejścia analogowe', 'Analog inputs', N('8 (A0 do A7), 10 bit; A6 i A7 tylko analogowe', '8 (A0 to A7), 10-bit; A6 and A7 are analog-only')],
      ['Przerwania', 'Interrupts', 'D2, D3'],
      ['Magistrale', 'Buses', 'UART D0/D1, I²C A4/A5, SPI D10 do D13'],
      ['USB', 'USB', N('mini-USB, FT232RL (oryginał) lub CH340 (klony)', 'mini-USB, FT232RL (original) or CH340 (clones)')],
      ['Poziom logiczny', 'Logic level', '5 V'],
      ['Zasilanie', 'Power', N('USB albo pin VIN 7 do 12 V', 'USB or the VIN pin at 7 to 12 V')]
    ],
    ex: [
      { k: 'dig', t: N('Mruganie diodą', 'Blink an LED'), d: N('LED_BUILTIN to wbudowana dioda na pinie 13. Wyjście cyfrowe daje 5 V albo 0 V.', 'LED_BUILTIN is the on-board LED on pin 13. A digital output gives 5 V or 0 V.'), w: N('Nic nie podłączasz, dioda jest na płytce', 'Nothing to wire, the LED is on the board'),
        code: 'void setup() {\n  pinMode(LED_BUILTIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_BUILTIN, HIGH);\n  delay(500);\n  digitalWrite(LED_BUILTIN, LOW);\n  delay(500);\n}\n' },
      { k: 'dig', t: N('Przycisk z pull-upem', 'Button with pull-up'), d: N('INPUT_PULLUP włącza wewnętrzny rezystor, więc przycisk łączysz tylko z masą. Wciśnięty daje LOW.', 'INPUT_PULLUP turns on an internal resistor, so the button only goes to ground. Pressed reads LOW.'), w: N('D2 → przycisk → GND', 'D2 → button → GND'),
        code: R`const int BTN = 2;

void setup() {
  pinMode(BTN, INPUT_PULLUP);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, digitalRead(BTN) == LOW);
}
` },
      { k: 'ana', t: N('Potencjometr i napięcie', 'Potentiometer and voltage'), d: N('analogRead zwraca 0 do 1023, co odpowiada 0 do 5 V.', 'analogRead returns 0 to 1023, which maps to 0 to 5 V.'), w: N('Środek potencjometru → A0, skrajne → 5V i GND', 'Potentiometer wiper → A0, outer legs → 5V and GND'),
        code: 'const int POT = A0;\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int raw = analogRead(POT);\n  float volts = raw * 5.0 / 1023.0;\n  Serial.print(raw);\n  Serial.print("  ");\n  Serial.print(volts);\n  Serial.println(" V");\n  delay(200);\n}\n' },
      { k: 'ana', t: N('Jasność diody z potencjometru (PWM)', 'LED brightness from a potentiometer (PWM)'), d: N('analogWrite generuje PWM 0 do 255 tylko na pinach D3, D5, D6, D9, D10 i D11.', 'analogWrite generates PWM from 0 to 255 only on pins D3, D5, D6, D9, D10 and D11.'), w: N('A0 → środek potencjometru, D6 → rezystor 220 Ω → anoda LED, katoda → GND', 'A0 → potentiometer wiper, D6 → 220 Ω resistor → LED anode, cathode → GND'),
        code: 'const int POT = A0;\nconst int LED = 6;\n\nvoid setup() {\n  pinMode(LED, OUTPUT);\n}\n\nvoid loop() {\n  int v = analogRead(POT);\n  analogWrite(LED, map(v, 0, 1023, 0, 255));\n}\n' },
      { k: 'ana', t: N('Czujnik światła na A7', 'Light sensor on A7'), d: N('Dzielnik napięcia z fotorezystorem i rezystorem 10 kΩ. A6 i A7 są tylko wejściami analogowymi, więc świetnie nadają się do czujników, ale nie do diod.', 'A voltage divider with a photoresistor and a 10 kΩ resistor. A6 and A7 are analog inputs only, so they suit sensors but not LEDs.'), w: N('5V → fotorezystor → A7 → rezystor 10 kΩ → GND', '5V → photoresistor → A7 → 10 kΩ resistor → GND'),
        code: 'const int LDR = A7;\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  Serial.println(analogRead(LDR));\n  delay(200);\n}\n' },
      { k: 'bus', t: N('Skaner I²C', 'I²C scanner'), d: N('Wypisuje adresy wszystkich urządzeń na magistrali, więc od razu widać, czy czujnik jest dobrze podłączony.', 'Prints the address of every device on the bus, so you immediately see whether a sensor is wired correctly.'), w: N('A4 → SDA, A5 → SCL, zasilanie 5V (lub 3V3) i GND', 'A4 → SDA, A5 → SCL, power 5V (or 3V3) and GND'),
        code: I2C_SCAN }
    ],
    ide: {
      rows: avrIde('Arduino Nano', 'ATmega328P (Old Bootloader)', '57600 (Old Bootloader)', N('Nowy bootloader używa 115200, stary 57600. Wartość wynika z wyboru Processor.', 'The new bootloader uses 115200, the old one 57600. The value follows from the Processor choice.'), N('Pakiet „Arduino AVR Boards” jest wbudowany w IDE.', 'The “Arduino AVR Boards” package is built into the IDE.'), N('Większość klonów ma stary bootloader. Jeśli wgrywanie kończy się błędem, spróbuj drugiej opcji, czyli ATmega328P.', 'Most clones have the old bootloader. If the upload fails, try the other option, ATmega328P.')),
      steps: [
        N('Podłącz płytkę kablem mini-USB z liniami danych. Klon z CH340 wymaga sterownika CH340.', 'Plug the board in with a mini-USB cable that carries data. A CH340 clone needs the CH340 driver.'),
        N('W Tools → Board → Arduino AVR Boards wybierz Arduino Nano.', 'In Tools → Board → Arduino AVR Boards choose Arduino Nano.'),
        N('W Tools → Processor wybierz ATmega328P (Old Bootloader) dla klona. Oryginał z nowym bootloaderem to ATmega328P.', 'In Tools → Processor pick ATmega328P (Old Bootloader) for a clone. An original with the new bootloader is ATmega328P.'),
        N('W Tools → Port wybierz port, który pojawił się po podłączeniu.', 'In Tools → Port pick the port that appeared when you plugged in.'),
        N('Kliknij Upload. Jeśli kończy się błędem stk500_getsync, przełącz Processor na drugą opcję i spróbuj ponownie.', 'Click Upload. If it ends with a stk500_getsync error, switch Processor to the other option and try again.'),
        N('Serial Monitor ustaw na tyle baudów, ile w Serial.begin, na przykład 9600.', 'Set Serial Monitor to the baud in Serial.begin, for example 9600.')
      ],
      tips: UNO_COMMON_IDE_TIPS
    }
  });

  function md(n) {
    var s = '';
    var port = { 22: 'PA0', 23: 'PA1', 24: 'PA2', 25: 'PA3', 26: 'PA4', 27: 'PA5', 28: 'PA6', 29: 'PA7' };
    if (port[n]) s = port[n];
    var t = ['dig'];
    var k = 'io';
    var x = null;
    if (n === 50) { s = 'MISO'; k = 'com'; t.push('spi'); x = N('Linia MISO magistrali SPI (na Megi SPI jest na D50 do D53).', 'MISO line of the SPI bus (on the Mega SPI is on D50 to D53).'); }
    if (n === 51) { s = 'MOSI'; k = 'com'; t.push('spi'); x = N('Linia MOSI magistrali SPI.', 'MOSI line of the SPI bus.'); }
    if (n === 52) { s = 'SCK'; k = 'com'; t.push('spi'); x = N('Linia SCK magistrali SPI.', 'SCK line of the SPI bus.'); }
    if (n === 53) { s = 'SS'; k = 'com'; t.push('spi'); x = N('Linia CS magistrali SPI. Ustaw jako wyjście, nawet gdy jej nie używasz.', 'Chip select of the SPI bus. Keep it an output even when you do not use it.'); }
    if (n >= 44 && n <= 46) { s = 'PWM'; t.push('pwm'); x = N('Wyjście PWM (analogWrite).', 'PWM output (analogWrite).'); }
    return P('D' + n, s, k, t, x);
  }

  function mt(n) {
    var tbl = {
      0: ['RX0', 'com', ['dig', 'uart'], X_UART, W_UART],
      1: ['TX0', 'com', ['dig', 'uart'], X_UART, W_UART],
      2: ['PWM · INT4', 'io', ['dig', 'pwm', 'int'], N('PWM i wejście przerwania INT4.', 'PWM and interrupt input INT4.')],
      3: ['PWM · INT5', 'io', ['dig', 'pwm', 'int'], N('PWM i wejście przerwania INT5.', 'PWM and interrupt input INT5.')],
      13: ['PWM · LED', 'io', ['dig', 'pwm', 'led'], N('PWM i dioda LED_BUILTIN.', 'PWM and the LED_BUILTIN LED.')],
      14: ['TX3', 'com', ['dig', 'uart'], N('UART3 (Serial3), nadawanie.', 'UART3 (Serial3), transmit.')],
      15: ['RX3', 'com', ['dig', 'uart'], N('UART3 (Serial3), odbiór.', 'UART3 (Serial3), receive.')],
      16: ['TX2', 'com', ['dig', 'uart'], N('UART2 (Serial2), nadawanie.', 'UART2 (Serial2), transmit.')],
      17: ['RX2', 'com', ['dig', 'uart'], N('UART2 (Serial2), odbiór.', 'UART2 (Serial2), receive.')],
      18: ['TX1 · INT3', 'com', ['dig', 'uart', 'int'], N('UART1 (Serial1), nadawanie, i wejście przerwania INT3.', 'UART1 (Serial1), transmit, and interrupt input INT3.')],
      19: ['RX1 · INT2', 'com', ['dig', 'uart', 'int'], N('UART1 (Serial1), odbiór, i wejście przerwania INT2.', 'UART1 (Serial1), receive, and interrupt input INT2.')],
      20: ['SDA · INT1', 'com', ['dig', 'i2c', 'int'], N('Linia SDA magistrali I²C i wejście przerwania INT1.', 'The SDA line of the I²C bus and interrupt input INT1.')],
      21: ['SCL · INT0', 'com', ['dig', 'i2c', 'int'], N('Linia SCL magistrali I²C i wejście przerwania INT0.', 'The SCL line of the I²C bus and interrupt input INT0.')]
    };
    if (n >= 4 && n <= 12) return P('D' + n, 'PWM', 'io', ['dig', 'pwm'], N('Wyjście PWM (analogWrite).', 'PWM output (analogWrite).'));
    if (tbl[n]) {
      var d = tbl[n];
      return P('D' + n, d[0], d[1], d[2], d[3], d[4]);
    }
    return md(n);
  }

  function ma(n) {
    return P('A' + n, 'D' + (54 + n), 'adc', ['dig', 'adc'], N('Wejście analogowe 10 bit (0 do 1023). Działa też jako zwykły pin cyfrowy.', '10-bit analog input (0 to 1023). Also works as a plain digital pin.'));
  }

  function range(a, b, f) {
    var out = [];
    for (var i = a; i <= b; i++) out.push(f(i));
    return out;
  }

  var evens = [];
  var odds = [];
  evens.push(v5()); odds.push(v5());
  for (var q = 22; q <= 52; q += 2) { evens.push(md(q)); odds.push(md(q + 1)); }
  evens.push(gnd()); odds.push(gnd());

  Pinout.add({
    id: 'mega',
    family: 'arduino',
    tab: 'Mega 2560',
    name: N('Arduino Mega 2560', 'Arduino Mega 2560'),
    pcb: 'teal',
    w: 960, h: 500, r: 14, fs: 13, show: 1080, min: 900,
    pad: { l: 50, r: 210, t: 120, b: 120 },
    feats: [
      { t: 'usb', x: -22, y: 60, w: 92, h: 84, txt: 'USB-B' },
      { t: 'jack', x: -22, y: 300, w: 82, h: 74, txt: 'DC' },
      { t: 'btn', x: 136, y: 70, txt: 'RESET' },
      { t: 'ic', x: 130, y: 236, w: 64, h: 40, txt: '16U2' },
      { t: 'ic', x: 380, y: 196, w: 130, h: 130, txt: 'ATmega2560' },
      { t: 'led', x: 338, y: 74, c: 'orange', txt: 'L' },
      { t: 'txt', x: 600, y: 420, txt: 'ARDUINO MEGA 2560', big: true }
    ],
    headers: [
      { x: 190, y: 26, dir: 'h', out: 't', pins: [i2cPin('SCL', 'D21'), i2cPin('SDA', 'D20'), aref(), gnd(), mt(13), mt(12), mt(11), mt(10), mt(9), mt(8)] },
      { x: 444, y: 26, dir: 'h', out: 't', pins: range(0, 7, function (i) { return mt(7 - i); }) },
      { x: 650, y: 26, dir: 'h', out: 't', pins: range(14, 21, mt) },
      {
        x: 246, y: 474, dir: 'h', out: 'b', pins: [P('NC', '', 'sys', [], N('Niepodłączony. Zarezerwowany.', 'Not connected. Reserved.')),
          P('IOREF', '', 'sys', [], N('Informuje shieldy o napięciu logicznym płytki (5 V).', 'Tells shields the logic voltage of the board (5 V).')),
          reset(), v33(UNO_3V3), v5(UNO_5V), gnd(), gnd(), vin(UNO_VIN)]
      },
      { x: 452, y: 474, dir: 'h', out: 'b', pins: range(0, 7, ma) },
      { x: 650, y: 474, dir: 'h', out: 'b', pins: range(8, 15, ma) },
      { x: 890, y: 60, dir: 'v', out: 'l', onpcb: true, pins: evens },
      { x: 922, y: 60, dir: 'v', out: 'r', pins: odds }
    ],
    desc: [
      N('Duża płytka na ATmega2560 z 54 pinami cyfrowymi (15 z PWM), 16 wejściami analogowymi i czterema sprzętowymi UART-ami. Układ pinów A0 do A7 i D0 do D13 pokrywa się z Uno, więc większość shieldów od Uno pasuje.', 'A big board on an ATmega2560 with 54 digital pins (15 with PWM), 16 analog inputs and four hardware UARTs. The A0 to A7 and D0 to D13 layout matches the Uno, so most Uno shields fit.'),
      N('Uwaga na magistrale: na Megi I²C jest na D20 i D21 (nie na A4 i A5), a SPI na D50 do D53 (nie na D10 do D13). Podwójny rząd D22 do D53 po prawej narysowany jest zgodnie z typowym schematem, więc przy pinach D22 do D53 sprawdź sitodruk.', 'Mind the buses: on the Mega I²C is on D20 and D21 (not A4 and A5) and SPI on D50 to D53 (not D10 to D13). The double row D22 to D53 on the right follows the typical diagram, so check the silkscreen for D22 to D53.')
    ],
    uses: [
      N('Drukarki 3D i frezarki CNC (na przykład z shieldem RAMPS), bo ma dużo pinów i pamięci.', '3D printers and CNC mills (for example with a RAMPS shield), because it has many pins and memory.'),
      N('Duże macierze LED, klawiatury matrycowe i panele przycisków.', 'Large LED matrices, keypads and button panels.'),
      N('Sterowanie wieloma serwami, przekaźnikami i silnikami jednocześnie.', 'Driving many servos, relays and motors at once.'),
      N('Łączenie kilku urządzeń szeregowych naraz (GPS, Bluetooth, moduł GSM) dzięki czterem UART-om.', 'Talking to several serial devices at once (GPS, Bluetooth, GSM) thanks to four UARTs.'),
      N('Roboty z wieloma czujnikami analogowymi na 16 wejściach.', 'Robots with many analog sensors on 16 inputs.')
    ],
    specs: [
      ['Mikrokontroler', 'Microcontroller', 'ATmega2560, 16 MHz'],
      ['Pamięć', 'Memory', N('256 KB flash, 8 KB SRAM, 4 KB EEPROM', '256 KB flash, 8 KB SRAM, 4 KB EEPROM')],
      ['Piny cyfrowe', 'Digital pins', N('54, w tym 15 z PWM', '54, 15 with PWM')],
      ['Piny PWM', 'PWM pins', 'D2 do D13, D44 do D46'],
      ['Wejścia analogowe', 'Analog inputs', N('16 (A0 do A15), 10 bit', '16 (A0 to A15), 10-bit')],
      ['Przerwania', 'Interrupts', 'D2, D3, D18, D19, D20, D21'],
      ['Magistrale', 'Buses', 'UART D0/D1, D19/D18, D17/D16, D15/D14; I²C D20/D21; SPI D50 do D53'],
      ['Poziom logiczny', 'Logic level', '5 V'],
      ['Prąd pinu', 'Pin current', N('zalecane do 20 mA, absolutne maksimum 40 mA', '20 mA recommended, 40 mA absolute max')],
      ['Zasilanie', 'Power', N('USB lub gniazdo DC 7 do 12 V (dopuszczalne 6 do 20 V)', 'USB or DC jack 7 to 12 V (6 to 20 V allowed)')]
    ],
    ex: [
      { k: 'dig', t: N('Mruganie diodą', 'Blink an LED'), d: N('LED_BUILTIN to wbudowana dioda na pinie 13. Wyjście cyfrowe daje 5 V albo 0 V.', 'LED_BUILTIN is the on-board LED on pin 13. A digital output gives 5 V or 0 V.'), w: N('Nic nie podłączasz, dioda jest na płytce', 'Nothing to wire, the LED is on the board'),
        code: 'void setup() {\n  pinMode(LED_BUILTIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_BUILTIN, HIGH);\n  delay(500);\n  digitalWrite(LED_BUILTIN, LOW);\n  delay(500);\n}\n' },
      { k: 'dig', t: N('Przycisk z przerwaniem', 'Button with an interrupt'), d: N('Pin D2 obsługuje przerwanie, więc program reaguje na wciśnięcie natychmiast, bez ciągłego sprawdzania w loop. Zmienna współdzielona z przerwaniem musi być volatile.', 'Pin D2 supports an interrupt, so the sketch reacts to a press immediately, without polling in loop. A variable shared with an interrupt must be volatile.'), w: N('D2 → przycisk → GND', 'D2 → button → GND'),
        code: R`const int BTN = 2;
volatile unsigned long presses = 0;

void onPress() {
  presses++;
}

void setup() {
  Serial.begin(9600);
  pinMode(BTN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(BTN), onPress, FALLING);
}

void loop() {
  Serial.println(presses);
  delay(500);
}
` },
      { k: 'dig', t: N('Wężyk z ośmiu diod na porcie', 'Eight-LED chaser on a port'), d: N('Piny D22 do D29 to osiem bitów portu A mikrokontrolera, więc cały rząd ustawiasz jedną instrukcją. DDRA ustawia kierunek, PORTA wartości.', 'Pins D22 to D29 are the eight bits of port A on the microcontroller, so you set the whole row with one statement. DDRA sets the direction, PORTA the values.'), w: N('D22 do D29 → po jednym rezystorze 220 Ω → osiem diod LED → GND', 'D22 to D29 → one 220 Ω resistor each → eight LEDs → GND'),
        code: R`void setup() {
  DDRA = 0xFF;
}

void loop() {
  for (int i = 0; i < 8; i++) {
    PORTA = 1 << i;
    delay(100);
  }
}
` },
      { k: 'ana', t: N('Odczyt kilku wejść analogowych', 'Reading several analog inputs'), d: N('Mega ma 16 wejść analogowych, więc można odczytać wiele czujników w pętli. Każde daje 0 do 1023.', 'The Mega has 16 analog inputs, so you can read many sensors in a loop. Each gives 0 to 1023.'), w: N('Czujniki lub potencjometry → A0, A1, A2, zasilanie 5V i GND', 'Sensors or potentiometers → A0, A1, A2, power 5V and GND'),
        code: R`void setup() {
  Serial.begin(9600);
}

void loop() {
  for (int i = A0; i <= A2; i++) {
    Serial.print(analogRead(i));
    Serial.print("  ");
  }
  Serial.println();
  delay(200);
}
` },
      { k: 'ana', t: N('Płynne rozjaśnianie (PWM)', 'Smooth fade (PWM)'), d: N('Pin D44 ma PWM. analogWrite przyjmuje wartości 0 do 255.', 'Pin D44 has PWM. analogWrite takes values from 0 to 255.'), w: N('D44 → rezystor 220 Ω → anoda LED, katoda → GND', 'D44 → 220 Ω resistor → LED anode, cathode → GND'),
        code: R`const int LED = 44;

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  for (int d = 0; d <= 255; d++) {
    analogWrite(LED, d);
    delay(5);
  }
  for (int d = 255; d >= 0; d--) {
    analogWrite(LED, d);
    delay(5);
  }
}
` },
      { k: 'bus', t: N('Drugi port szeregowy (Serial1)', 'A second serial port (Serial1)'), d: N('Serial rozmawia z komputerem przez USB, a Serial1 z innym urządzeniem na pinach D18 (TX1) i D19 (RX1). Ten program przekazuje dane z urządzenia do monitora.', 'Serial talks to the computer over USB, and Serial1 talks to another device on pins D18 (TX1) and D19 (RX1). This sketch forwards data from the device to the monitor.'), w: N('TX urządzenia → D19 (RX1), RX urządzenia → D18 (TX1), wspólna masa GND', 'Device TX → D19 (RX1), device RX → D18 (TX1), common GND'),
        code: R`void setup() {
  Serial.begin(9600);
  Serial1.begin(9600);
}

void loop() {
  if (Serial1.available()) {
    Serial.write(Serial1.read());
  }
}
` },
      { k: 'bus', t: N('Skaner I²C', 'I²C scanner'), d: N('Wypisuje adresy wszystkich urządzeń na magistrali. Na Megi I²C jest na D20 i D21.', 'Prints the address of every device on the bus. On the Mega I²C is on D20 and D21.'), w: N('D20 → SDA, D21 → SCL, zasilanie 5V (lub 3V3) i GND', 'D20 → SDA, D21 → SCL, power 5V (or 3V3) and GND'),
        code: I2C_SCAN }
    ],
    ide: {
      rows: avrIde('Arduino Mega or Mega 2560', 'ATmega2560 (Mega 2560)', '115200 (stała)', N('Wynika z bootloadera i nie ma osobnej opcji w menu.', 'Comes from the bootloader and has no menu option.'), N('Pakiet „Arduino AVR Boards” jest wbudowany w IDE.', 'The “Arduino AVR Boards” package is built into the IDE.'), N('Jedyny sensowny wybór dla Mega 2560. Wersja ADK to inna płytka.', 'The only sensible choice for the Mega 2560. The ADK version is a different board.')),
      steps: [
        N('Podłącz płytkę kablem USB-B z liniami danych.', 'Plug the board in with a USB-B cable that carries data.'),
        N('W Tools → Board → Arduino AVR Boards wybierz Arduino Mega or Mega 2560.', 'In Tools → Board → Arduino AVR Boards choose Arduino Mega or Mega 2560.'),
        N('W Tools → Processor wybierz ATmega2560 (Mega 2560).', 'In Tools → Processor pick ATmega2560 (Mega 2560).'),
        N('W Tools → Port wybierz port, który pojawił się po podłączeniu.', 'In Tools → Port pick the port that appeared when you plugged in.'),
        N('Kliknij Upload. Wgrywanie trwa dłużej niż na Uno, bo program może być większy.', 'Click Upload. The upload takes longer than on the Uno because the sketch can be bigger.'),
        N('Serial Monitor ustaw na tyle baudów, ile w Serial.begin, na przykład 9600.', 'Set Serial Monitor to the baud in Serial.begin, for example 9600.')
      ],
      tips: UNO_COMMON_IDE_TIPS
    }
  });

  function pm(n) {
    var tbl = {
      D2: ['SDA · INT1', 'com', ['dig', 'i2c', 'int'], N('Linia SDA magistrali I²C i wejście przerwania INT1.', 'The SDA line of the I²C bus and interrupt input INT1.')],
      D3: ['PWM · SCL · INT0', 'com', ['dig', 'pwm', 'i2c', 'int'], N('PWM, linia SCL magistrali I²C i wejście przerwania INT0.', 'PWM, the SCL line of the I²C bus and interrupt input INT0.')],
      D4: ['A6', 'adc', ['dig', 'adc'], N('Wejście analogowe A6 i zwykły pin cyfrowy.', 'Analog input A6 and a plain digital pin.')],
      D5: ['PWM', 'io', ['dig', 'pwm'], N('Wyjście PWM (analogWrite).', 'PWM output (analogWrite).')],
      D6: ['PWM · A7', 'adc', ['dig', 'pwm', 'adc'], N('PWM oraz wejście analogowe A7.', 'PWM and analog input A7.')],
      D7: ['INT6', 'io', ['dig', 'int'], N('Wejście przerwania INT6.', 'Interrupt input INT6.')],
      D8: ['A8', 'adc', ['dig', 'adc'], N('Wejście analogowe A8 i zwykły pin cyfrowy.', 'Analog input A8 and a plain digital pin.')],
      D9: ['PWM · A9', 'adc', ['dig', 'pwm', 'adc'], N('PWM oraz wejście analogowe A9.', 'PWM and analog input A9.')],
      D10: ['PWM · A10', 'adc', ['dig', 'pwm', 'adc'], N('PWM oraz wejście analogowe A10.', 'PWM and analog input A10.')],
      D14: ['MISO', 'com', ['dig', 'spi'], N('Linia MISO magistrali SPI.', 'MISO line of the SPI bus.')],
      D15: ['SCK', 'com', ['dig', 'spi'], N('Linia SCK magistrali SPI.', 'SCK line of the SPI bus.')],
      D16: ['MOSI', 'com', ['dig', 'spi'], N('Linia MOSI magistrali SPI.', 'MOSI line of the SPI bus.')]
    };
    var d = tbl[n];
    return P(n, d[0], d[1], d[2], d[3]);
  }

  function pa(n) {
    return P('A' + n, 'D' + (18 + n), 'adc', ['dig', 'adc'], N('Wejście analogowe 10 bit (0 do 1023). Działa też jako zwykły pin cyfrowy.', '10-bit analog input (0 to 1023). Also works as a plain digital pin.'));
  }

  Pinout.add({
    id: 'promicro',
    family: 'arduino',
    tab: 'Pro Micro',
    name: N('Arduino Pro Micro (ATmega32U4)', 'Arduino Pro Micro (ATmega32U4)'),
    pcb: 'red',
    w: 168, h: 370, r: 10, fs: 12, show: 540,
    pad: { l: 230, r: 230, t: 30, b: 20 },
    feats: [
      { t: 'usb', x: 54, y: -20, w: 60, h: 54, txt: 'micro-USB' },
      { t: 'led', x: 70, y: 56, c: 'blue', txt: 'TX' },
      { t: 'led', x: 98, y: 56, c: 'green', txt: 'RX' },
      { t: 'ic', x: 54, y: 126, w: 60, h: 60, txt: '32U4' },
      { t: 'ic', x: 68, y: 226, w: 32, h: 20, txt: 'REG' },
      { t: 'txt', x: 84, y: 296, txt: 'PRO MICRO', big: true }
    ],
    headers: [
      {
        x: 12, y: 70, dir: 'v', out: 'l', pins: [
          P('TXO', 'D1 · Serial1 TX', 'com', ['dig', 'uart'], N('Sprzętowy UART Serial1 (nadawanie). Serial to osobny port USB.', 'Hardware UART Serial1 (transmit). Serial is the separate USB port.')),
          P('RXI', 'D0 · Serial1 RX', 'com', ['dig', 'uart'], N('Sprzętowy UART Serial1 (odbiór). Serial to osobny port USB.', 'Hardware UART Serial1 (receive). Serial is the separate USB port.')),
          gnd(), gnd(), pm('D2'), pm('D3'), pm('D4'), pm('D5'), pm('D6'), pm('D7'), pm('D8'), pm('D9')]
      },
      {
        x: 156, y: 70, dir: 'v', out: 'r', pins: [
          P('RAW', '', 'pwr', ['pwr'], N('Wejście zasilania 5 do 12 V przez regulator. Przy zasilaniu z USB jest tu ok. 5 V.', 'Power input of 5 to 12 V through the regulator. When powered from USB it carries about 5 V.')),
          gnd(),
          P('RST', '', 'sys', ['rst'], N('Zwarcie z GND resetuje płytkę. Dwa szybkie zwarcia uruchamiają bootloader na kilka sekund.', 'Shorting to GND resets the board. Two quick shorts start the bootloader for a few seconds.')),
          P('VCC', '', 'pwr', ['pwr'], N('Napięcie płytki: 5 V w wersji 5 V / 16 MHz, 3,3 V w wersji 3,3 V / 8 MHz.', 'Board voltage: 5 V on the 5 V / 16 MHz version, 3.3 V on the 3.3 V / 8 MHz version.')),
          pa(3), pa(2), pa(1), pa(0), pm('D15'), pm('D14'), pm('D16'), pm('D10')]
      }
    ],
    desc: [
      N('Malutka płytka na ATmega32U4 z natywnym USB. Dzięki temu potrafi udawać klawiaturę, mysz, pada albo urządzenie MIDI, czego Uno i Nano nie zrobią bez dodatkowego układu. Ma micro-USB i nie ma przycisku reset.', 'A tiny board on an ATmega32U4 with native USB. Thanks to that it can pretend to be a keyboard, mouse, gamepad or MIDI device, which the Uno and Nano cannot do without an extra chip. It has micro-USB and no reset button.'),
      N('Wyprowadzonych jest tylko 12 pinów po każdej stronie, ale część z nich ma kilka funkcji naraz (na przykład D4 to też A6). W IDE wybierasz Arduino Leonardo, bo to ten sam układ. Wersja 3,3 V / 8 MHz wymaga osobnych ustawień, bo działa wolniej.', 'Only 12 pins per side are broken out, but several have multiple functions (for example D4 is also A6). In the IDE you choose Arduino Leonardo, because it is the same chip. The 3.3 V / 8 MHz version needs separate settings because it runs slower.')
    ],
    uses: [
      N('Klawiatury DIY i makropady: każdy przycisk wysyła dowolny skrót klawiszowy.', 'DIY keyboards and macro pads: each button sends any key combination.'),
      N('Myszy, joysticki i pady USB rozpoznawane przez komputer bez sterowników.', 'USB mice, joysticks and gamepads recognized by the computer without drivers.'),
      N('Kontrolery MIDI z potencjometrami i przyciskami.', 'MIDI controllers with potentiometers and buttons.'),
      N('Małe urządzenia wpinane do USB, które mają się zmieścić w obudowie.', 'Small USB devices that must fit in a tight enclosure.'),
      N('Zwykłe projekty z czujnikami i diodami, gdy Nano jest za duże.', 'Ordinary sensor and LED projects when a Nano is too big.')
    ],
    specs: [
      ['Mikrokontroler', 'Microcontroller', N('ATmega32U4, 16 MHz (5 V) lub 8 MHz (3,3 V)', 'ATmega32U4, 16 MHz (5 V) or 8 MHz (3.3 V)')],
      ['Pamięć', 'Memory', N('32 KB flash (4 KB bootloader), 2,5 KB SRAM, 1 KB EEPROM', '32 KB flash (4 KB bootloader), 2.5 KB SRAM, 1 KB EEPROM')],
      ['Piny cyfrowe', 'Digital pins', N('18 wyprowadzonych, w tym 5 z PWM', '18 broken out, 5 with PWM')],
      ['Piny PWM', 'PWM pins', 'D3, D5, D6, D9, D10'],
      ['Wejścia analogowe', 'Analog inputs', N('9: A0 do A3 oraz A6 do A10 (na D4, D6, D8, D9, D10), 10 bit', '9: A0 to A3 and A6 to A10 (on D4, D6, D8, D9, D10), 10-bit')],
      ['Przerwania', 'Interrupts', 'D0, D1, D2, D3, D7'],
      ['Magistrale', 'Buses', 'UART Serial1 D0/D1, I²C D2/D3, SPI D14 do D16'],
      ['USB', 'USB', N('natywne micro-USB (klawiatura, mysz, port szeregowy)', 'native micro-USB (keyboard, mouse, serial port)')],
      ['Poziom logiczny', 'Logic level', N('5 V lub 3,3 V zależnie od wersji', '5 V or 3.3 V depending on the version')],
      ['Zasilanie', 'Power', N('USB albo pin RAW 5 do 12 V', 'USB or the RAW pin at 5 to 12 V')]
    ],
    ex: [
      { k: 'dig', t: N('Mruganie diodą', 'Blink an LED'), d: N('Na Pro Micro nie ma diody na pinie 13, więc użyj zewnętrznej. Wyjście cyfrowe daje 5 V albo 0 V.', 'There is no LED on pin 13 of the Pro Micro, so use an external one. A digital output gives 5 V or 0 V.'), w: N('D5 → rezystor 220 Ω → anoda LED, katoda → GND', 'D5 → 220 Ω resistor → LED anode, cathode → GND'),
        code: 'const int LED = 5;\n\nvoid setup() {\n  pinMode(LED, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED, HIGH);\n  delay(500);\n  digitalWrite(LED, LOW);\n  delay(500);\n}\n' },
      { k: 'dig', t: N('Klawiatura USB', 'USB keyboard'), d: N('Płytka wpisuje tekst w aktywnym oknie komputera po wciśnięciu przycisku. Zawsze warunkuj wysyłanie przyciskiem i dodaj pauzę, żeby program nie zalewał komputera tekstem i dało się go jeszcze wgrać.', 'The board types text into the active window when you press the button. Always gate sending on the button and add a pause, so the sketch does not flood the computer with text and you can still upload.'), w: N('D4 → przycisk → GND', 'D4 → button → GND'),
        code: R`#include <Keyboard.h>

const int BTN = 4;

void setup() {
  pinMode(BTN, INPUT_PULLUP);
  Keyboard.begin();
}

void loop() {
  if (digitalRead(BTN) == LOW) {
    Keyboard.println("Hello from Pro Micro");
    delay(1000);
  }
}
` },
      { k: 'ana', t: N('Potencjometr i napięcie', 'Potentiometer and voltage'), d: N('analogRead zwraca 0 do 1023. Serial na tej płytce to port USB, więc czeka na otwarcie monitora.', 'analogRead returns 0 to 1023. Serial on this board is the USB port, so it waits for the monitor to open.'), w: N('Środek potencjometru → A0, skrajne → VCC i GND', 'Potentiometer wiper → A0, outer legs → VCC and GND'),
        code: 'const int POT = A0;\n\nvoid setup() {\n  Serial.begin(9600);\n  while (!Serial) {\n  }\n}\n\nvoid loop() {\n  Serial.println(analogRead(POT));\n  delay(200);\n}\n' },
      { k: 'ana', t: N('Jasność diody z potencjometru (PWM)', 'LED brightness from a potentiometer (PWM)'), d: N('analogWrite działa na D3, D5, D6, D9 i D10. map przelicza zakres 0 do 1023 na 0 do 255.', 'analogWrite works on D3, D5, D6, D9 and D10. map converts the 0 to 1023 range to 0 to 255.'), w: N('A0 → środek potencjometru, D9 → rezystor 220 Ω → anoda LED, katoda → GND', 'A0 → potentiometer wiper, D9 → 220 Ω resistor → LED anode, cathode → GND'),
        code: 'const int POT = A0;\nconst int LED = 9;\n\nvoid setup() {\n  pinMode(LED, OUTPUT);\n}\n\nvoid loop() {\n  int v = analogRead(POT);\n  analogWrite(LED, map(v, 0, 1023, 0, 255));\n}\n' },
      { k: 'bus', t: N('Skaner I²C', 'I²C scanner'), d: N('Wypisuje adresy wszystkich urządzeń na magistrali. Na Pro Micro I²C jest na D2 (SDA) i D3 (SCL).', 'Prints the address of every device on the bus. On the Pro Micro I²C is on D2 (SDA) and D3 (SCL).'), w: N('D2 → SDA, D3 → SCL, zasilanie VCC i GND', 'D2 → SDA, D3 → SCL, power VCC and GND'),
        code: I2C_SCAN.replace('Serial.begin(9600);', 'Serial.begin(9600);\n  while (!Serial) {\n  }') }
    ],
    ide: {
      rows: avrIde('Arduino Leonardo', null, 'automatyczna (USB)', N('Płytka sama przełącza się w tryb bootloadera przez USB. Nie ma opcji prędkości.', 'The board switches itself into the bootloader over USB. There is no speed option.'), N('Ten sam układ ATmega32U4, wbudowany w IDE. Nic nie instalujesz. Dla wersji 3,3 V / 8 MHz zainstaluj pakiet SparkFun AVR Boards i wybierz SparkFun Pro Micro.', 'The same ATmega32U4 chip, built into the IDE. Nothing to install. For the 3.3 V / 8 MHz version install the SparkFun AVR Boards package and choose SparkFun Pro Micro.')),
      steps: [
        N('Podłącz płytkę kablem micro-USB z liniami danych.', 'Plug the board in with a micro-USB cable that carries data.'),
        N('W Tools → Board → Arduino AVR Boards wybierz Arduino Leonardo.', 'In Tools → Board → Arduino AVR Boards choose Arduino Leonardo.'),
        N('W Tools → Port wybierz port, który pojawił się po podłączeniu.', 'In Tools → Port pick the port that appeared when you plugged in.'),
        N('Kliknij Upload. Podczas wgrywania port na chwilę znika i wraca pod inną nazwą, to normalne.', 'Click Upload. During the upload the port disappears for a moment and returns under another name, which is normal.'),
        N('Gdy wgrywanie się nie udaje, zewrzyj dwa razy szybko RST z GND, a w ciągu ok. 8 sekund wybierz nowy port i kliknij Upload.', 'If the upload fails, short RST to GND twice quickly, then within about 8 seconds pick the new port and click Upload.'),
        N('Serial Monitor działa przez USB, więc baud nie ma znaczenia dla Serial. Dla Serial1 (D0 i D1) ustaw baud z Serial1.begin.', 'Serial Monitor runs over USB, so baud does not matter for Serial. For Serial1 (D0 and D1) use the baud from Serial1.begin.')
      ],
      tips: [
        N('Płytka przestała się wgrywać po programie, który spamuje klawiaturę lub mysz: użyj podwójnego resetu i wgraj pusty szkic. Dlatego warunkuj Keyboard przyciskiem.', 'The board stopped uploading after a sketch that spams the keyboard or mouse: use the double reset and upload an empty sketch. That is why you gate Keyboard on a button.'),
        N('Brak portu po wgraniu: poczekaj kilka sekund, port wraca. Jeśli nie wraca, użyj podwójnego resetu.', 'No port after upload: wait a few seconds, the port comes back. If it does not, use the double reset.'),
        N('Program nie rusza, dopóki monitor nie jest otwarty: to skutek while (!Serial). Usuń tę pętlę, gdy płytka ma działać bez komputera.', 'The sketch does not start until the monitor is open: that is the effect of while (!Serial). Remove that loop when the board should run without a computer.'),
        N('Wersja 3,3 V / 8 MHz wgrana jako 5 V / 16 MHz (lub odwrotnie) działa dziwnie lub wcale: wybierz właściwy wariant procesora.', 'A 3.3 V / 8 MHz version flashed as 5 V / 16 MHz (or the reverse) behaves oddly or not at all: pick the right processor variant.')
      ]
    }
  });
})();
