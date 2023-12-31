# node-sorter

### Дано:

Есть файл 1ТБ, состоящий из строк. Его нужно отсортировать при ограничении ОЗУ 500МБ.

---

### Общая логика решения задачи:

Работать целиком с тяжелым файлом не получится из-за ограничения на ОЗУ. Нужно использовать подход "разделяй и властвуй" - разбить его на более мелкие файлы, которые доступный объем памяти в состоянии обработать, отсортировать их содержимое по отдельности и слепить обратно в большой отсортированный файл.

---

### Конкретизации:

- Сортируются строки (не символы, не абзацы и тд).
- Используем двоичную систему для оценки размеров файлов и объема памяти.
- Допущение: в файле нет слишком длинных строк, которые невозможно разместить в доступной памяти.
- Для упрощения жизни используем везде кодировку utf-8 (это дефолтная кодировка для модуля fs).
- Тестить реальный 1ТБ файл нет возможности, поэтому будем работать с 2GiB файлом. Размер строки ограничим 1000 байтами (до 250-1000 символов в utf-8). Смягчение тестовых параметров не поменяет суть решения, зато позволит в реальном времени наблюдать за процессом работы программы.

---

### Подзадачи:

- РАЗБИЕНИЕ ИЗНАЧАЛЬНОГО ФАЙЛА.
  - Новые файлы должны содержать строки целиком, при этом длины строк могут сильно варьироваться. Для эффективного использования памяти, размер файлов разбиения должен быть максимально близким к ее доступному объему (минус какая-то фиксированная память для выполнения операций), но не превышать его. Как это обеспечить?
  - Заведем объект для хранения данных о том, какой объем текста можно еще разместить в каждом из уже созданных файлов. Далее читаем построчно изначальный файл. Если строку можно разместить в одном из существующих файлов, не привысив допустимый ОЗУ, размещаем, если нет - создаем новый файл и размещаем в нем. После этого обновляем данные по свободному пространству, и повторяем процесс, пока не обойдем все строки изначального файла.
- ОБРАТНОЕ СЛИЯНИЕ.

  - Создаем новый файл и массив с номерами текущих строк (индексами) для каждого файла разбиения - сначала это нули.
  - Находим файл с "наибольшим" значением, лежащим по его текущему индексу. Присоединяем это значение к новому файлу, а к индексу этого файла разбиения прибавляем 1. Процесс повторяется, пока текущие индексы не пройдутся полностью по каждому файлу разбиения, и все строки не будут скопированы в новый файл в отсортированном порядке.

  ***

### Заметки по реализации:

- .env файл исключен из gitignore, чтобы все работало из коробки.
- Порядок сортировки убывающий, чтобы пустые строки были отправлены в конец, и было проще проверять содержимое файлов.
- Для ограничения пямяти используем флаг --max-old-space-size=500 при запуске node.
- 20% памяти зарезервировано для корректной работы nodejs.
