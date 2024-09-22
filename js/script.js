function toggleDisplay(showDiv, hideDiv, temp) {
    document.getElementById(showDiv).style.display = 'block';
    document.getElementById(hideDiv).style.display = 'none';
    
    if(temp){
        displayInvestments();
    }
}

document.getElementById('addInvestment').addEventListener('click', function () {
    toggleDisplay('investment-form', 'investment-list',false);
    document.getElementById('plotly-div').style.display = 'none'
});

document.getElementById('showInvestment').addEventListener('click', function () {
    toggleDisplay('investment-list', 'investment-form',true);
    document.getElementById('plotly-div').style.display = 'block'
});



document.getElementById('investment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim(); //remove whtie spaces
    const value = document.getElementById('value').value.trim();
    const date = document.getElementById('date').value;

    const investment = {
        name: name,
        value: value,
        date: date
    };

    const editInvestment = this.dataset.editInvestment;

    if (validateInputs(investment)) {
        if (editInvestment) {
            fetch('backend/update_investment.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ index: editInvestment, investment: investment })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        displayInvestments();
                        this.reset();
                        showToast();
                        delete this.dataset.editInvestment;
                        document.getElementById('submit-btn').textContent = 'Pridať investíciu';
                    } else {
                        alert('Chyba pri úprave investície');
                    }
                }); 
        } else {
            fetch('backend/save_investment.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(investment)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showToast();
                        displayInvestments();
                        this.reset();
                    } else {
                        alert('Chyba pri pridávaní investície');
                    }
                });
        }
    }

});

function displayInvestments() {
    document.getElementById('plotly-div').style.display = 'block'
    fetch('backend/display_investments.php')
        .then(response => response.json())
        .then(investments => {
            const investmentList = document.getElementById('investment-list');
            investmentList.innerHTML = '';
            toggleDisplay('investment-list', 'investment-form');
            let totalInvestValue = 0;

            var data = [{
                values: [],
                labels: [],
                type: 'pie'
            }];

            var layout = {
                height: 400,
                width: 500
            };
            
            if(investments.length === 0 || investments == null) {
                const headingElement = document.createElement('h1');
                headingElement.textContent = `Neexistujú žiadne investície`;
                investmentList.appendChild(headingElement);

                document.getElementById('plotly').style.display = 'none';
            }
               
            else{ 
                investments.forEach(investment => {
                    totalInvestValue += Number(investment.value);
                    data[0].values.push(Number(investment.value));
                    data[0].labels.push(investment.name);
                });

                Plotly.newPlot('plotly', data, layout);

                const headingElement = document.createElement('h1');
                headingElement.textContent = `Celková hodnota portfólia je ${totalInvestValue} €`;
                investmentList.appendChild(headingElement);

                let body = createInvestments(investments, totalInvestValue);
                investmentList.appendChild(body);

            }
            });
}

function createInvestments(investments, totalInvestValue) {

    const investmentContainer = document.createElement('div');

    investments.forEach((investment, index) => {
        const investmentDiv = document.createElement('div');
        investmentDiv.classList.add('main-container');

        const infoContainer = document.createElement('div');
        infoContainer.classList.add('info-container');

        const nameElement = document.createElement('strong');
        nameElement.textContent = investment.name;

        const valueElement = document.createElement('p');
        valueElement.textContent = `Hodnota: ${investment.value} EUR`;

        const percentageElement = document.createElement('p');
        const percentage = (investment.value / totalInvestValue * 100).toFixed(2);
        percentageElement.textContent = `Percentuálny podiel: ${percentage}%`;

        const dateElement = document.createElement('p');
        dateElement.textContent = `Dátum nákupu investície: ${investment.date}`

        infoContainer.appendChild(nameElement);
        infoContainer.appendChild(valueElement);
        infoContainer.appendChild(percentageElement);
        infoContainer.appendChild(dateElement);

        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action-container');

        const editButton = document.createElement('button');
        editButton.textContent = 'Uprav investíciu';
        editButton.onclick = () => editInvestment(index);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Vymaž investíciu';
        deleteButton.onclick = () => deleteInvestment(index);

        actionContainer.appendChild(editButton);
        actionContainer.appendChild(deleteButton);

        investmentDiv.appendChild(infoContainer);
        investmentDiv.appendChild(actionContainer);

        investmentContainer.appendChild(investmentDiv);

    });

    return investmentContainer;

}

function deleteInvestment(index) {
    fetch('backend/delete_investment.php', {
        method: 'DELETE', //DELETE
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index: index })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast();
                displayInvestments();  // Znovu načíta zoznam
            } else {
                alert('Chyba pri mazaní investície');
            }
        });
}

function editInvestment(index) {
    document.getElementById('plotly-div').style.display = 'none'
    fetch('backend/display_investments.php')
        .then(response => response.json())
        .then(investments => {
            toggleDisplay('investment-form', 'investment-list', false);
            
            const investment = investments[index];

            document.getElementById('name').value = investment.name;
            document.getElementById('value').value = investment.value;
            document.getElementById('date').value = investment.date;

            document.getElementById('submit-btn').textContent = 'Upraviť investíciu';
            document.getElementById('investment-form').dataset.editInvestment = index; //tu editne dataset
        });
}

function validateInputs(investment) {

    const date = new Date(investment.date);

    function displayError(element, span) {
        element.style.border = "2px solid red";
        span.style.visibility = "visible";
        return false;
    }

    function hideError(element, span) {
        element.style.borderColor = "";
        span.style.visibility = "hidden";
    }

    //string to number validation
    if (investment.name === "" || !isNaN(investment.name)) {
        return displayError(document.getElementById('name'), document.getElementById('name-span'));
    } else {
        hideError(document.getElementById('name'), document.getElementById('name-span'));
    }

    if (investment.value === "" || investment.value <= 0) {
        return displayError(document.getElementById('value'), document.getElementById('value-span'));
    } else {
        hideError(document.getElementById('value'), document.getElementById('value-span'));
    }

    if(!date){
        return displayError(document.getElementById('date'), document.getElementById('date-span'));
    } else if (isNaN(date.getTime()) || date > new Date() || date.getFullYear() > new Date().getFullYear()) {
        return displayError(document.getElementById('date'), document.getElementById('date-span'));
    } else {
        hideError(document.getElementById('date'), document.getElementById('date-span'));
    }

    return true;
}


function showToast() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}


