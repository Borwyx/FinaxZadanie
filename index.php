<!DOCTYPE html>
<html lang="sk">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investičné portfólio</title>

    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/toast.css">

    <script src="https://cdn.plot.ly/plotly-2.27.0.min.js" charset="utf-8"></script>

</head>

<body>
    <div class="container">
        <h1>Investičné portfólio FINAX</h1>

        <div class="investments-btns">
            <button id="addInvestment" class="btns">Pridať investíciu</button>
            <button id="showInvestment" class="btns">Zobraziť investície</button>
        </div>

        <div id="investment-list" class="investment-list"></div>

        <form id="investment-form">
            <div class="form-group">
                <label for="name">Názov investície</label>
                <input type="text" id="name" placeholder="Názov investície">
                <span id="name-span" style="visibility: hidden">Zadajte názov investície</span>
            </div>
            <div class="form-group">
                <label for="value">Hodnota investície (EUR)</label>
                <input type="number" id="value" placeholder="Hodnota investície">
                <span id="value-span" style="visibility: hidden">Zadajte nezáporne a nenulové číslo</span>
            </div>
            <div class="form-group">
                <label for="date">Dátum nákupu</label>
                <input type="date" id="date" placeholder="1.1.2024">
                <span id="date-span" style="visibility: hidden">Zadajte validný dátum</span>
            </div>
            <button type="submit" id="submit-btn">Uložiť investíciu</button>
        </form>

        <div class="percentage-usage">
            <div id="plotly-div">
                <div id="plotly"></div>
            </div>
        </div>
    </div>

    <div id="snackbar">Operácia sa podarila</div>

    <!--<footer class="made-by">Made by Boris Velička</footer>-->

    <script src="js/script.js"></script>
</body>

</html>