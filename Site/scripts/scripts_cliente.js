var vUrlClientes = "http://127.0.0.1:5001/Cliente";
var vUrlEnderecos = "http://127.0.0.1:5001/Endereco";

$(document).ready(function (e) {
    carregarClientes();
});

function carregarClientes() {

    $.ajax({
        url: vUrlClientes,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        success: function (data) {
            var sel = $("#Clientes");
            sel.empty();
            data['Clientes'].forEach(e => {
                sel.append('<div class="container"><div class="row linha"><div class="row colunaSemPadding"><span class="NomeCliente">' + e.nome + '</span></div><div class="row"><div class="col colunaSemPadding"><button class="btn btn-warning btnAlterarCliente linhaBotao" data-bs-toggle="modal" data-bs-target="#AlteraCliente" id="Alterar" data-id="' + e.id + '" data-nome="' + e.nome + '" data-documento="' + e.documento + '">Alterar</button></div><div class="col colunaSemPadding"><button class="btn btn-success btnCadEndCliente linhaBotao" data-bs-toggle="modal" data-bs-target="#CadastrarEnderecoCliente data-id="' + e.id + '">Cadastrar Endereço</button></div><div class="col colunaSemPadding"><button class="btn btn-danger btnExcluirCliente linhaBotao" data-bs-toggle="modal" data-bs-target="#ExcluirCliente" data-id="' + e.id + '">Excluir</button></div></div><div class="row dados" id="dadosCliente_' + e.id + '"><span>dados</span></div></div></div>')

            });
            // alimentarSelectsSecao();
        },
        error: function () {
            console.log("Ocorreu um erro: " + dataType);
        }
    });
}



function alertas(msg, local, estilo, fecharAlerta) {
    $(local + ' .alerta').addClass(estilo);
    $(local + ' .alerta').html(msg);
    $(local + ' .alerta').show();
    setTimeout(function () {
        $(local + ' .alerta').hide();
        if (fecharAlerta == 'true')
            $(local + ' .btn-close').trigger('click');
        $(local + ' .alerta').removeClass(estilo);
    }, 2500);

}

function FecharModal(local) {
    $(local + ' .btn-close').trigger('click');
}

$('#btnCadCliente').on('click', function (e) {

    if (($("#formCadCliente #nomeCliente").val() == "") || ($("#formCadCliente #nomeCliente").val().length <= 2)) {
        alertas('O nome do cliente precisa ter mais de 3 caractéres', '#modCadCliente', 'alert_danger');
        return;
    }
    var vData = { nome: $("#formCadCliente #nomeCliente").val(), documento: $("#formCadCliente #documentoCliente").val() };

    $.ajax({
        url: vUrlClientes,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            carregarClientes()
            $('#formCadCliente #nomeCliente').val("")
            alertas('Cliente cadastrado com sucesso', '#modCadCliente', 'alert_sucess');
        },
        error: function (d) {
            console.log(d);
            alertas(d.responseJSON['msg'], '#modCadCliente', 'alert_danger');
        }
    }
    );
});
//btnCadEndCliente

$('#btnCadEndCliente').on('click', function (e) {
    console.log("fdfd");

    //var vData = { nome: $("#formCadCliente #nomeCliente").val(), documento: $("#formCadCliente #documentoCliente").val() };

    /*$.ajax({
        url: vUrlClientes,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            carregarClientes()
            $('#formCadCliente #nomeCliente').val("")
            alertas('Cliente cadastrado com sucesso', '#modCadCliente', 'alert_sucess');
        },
        error: function (d) {
            console.log(d);
            alertas(d.responseJSON['msg'], '#modCadCliente', 'alert_danger');
        }
    }
    );*/
});


$(document).on('click', '.btnAlterarCliente', function (e) {
    $('#formAltCliente #nomeCliente').val($(this).data("nome"));
    $('#formAltCliente #id').val($(this).data("id"));
    $('#formAltCliente #documentoCliente').val($(this).data("documento"));
    $('.opcoesConfirmacao').css('display', 'none');
});

$(document).on('click', '#exibConfirmaAlteracaoCliente', function (e) {
    $('.opcoesConfirmacao').css('display', 'flex');
});

$(document).on('click', '#btnConfirmaAlteracaoCliente', function (e) {

    if (($("#formAltCliente #nomeCliente").val() == "") || ($("#formAltCliente #nomeCliente").val().length <= 2)) {
        alertas('O nome do Cliente precisa ter mais de 2 caractéres', '#AlteraCliente', 'alert_danger');
        return;
    }

    var vData = {
        id: $('#formAltCliente #id').val(),
        nome: $('#formAltCliente #nomeCliente').val(),
        documento: $('#formAltCliente #documentoCliente').val()
    };

    $.ajax({
        url: vUrlClientes,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            carregarClientes();
            $('#formAltCliente #id').val('');
            $('#formAltCliente #nomeCliente').val('');
            $('#formAltCliente #documentoCliente').val('');
            $('.opcoesConfirmacao').css('display', 'none');

            alertas('Cliente atualizado com sucesso', '#AlteraCliente', 'alert_sucess', 'true');
        },
        error: function (d) {
            alertas(d.responseJSON['msg'], '#AlteraCliente', 'alert_danger');

            $('.opcoesConfirmacao').css('display', 'none');
        }
    }
    );
});

$(document).on('click', '#btnNaoConfirmaAlteracaoCliente', function (e) {
    $('#formAltCliente #id').val('');
    $('#formAltCliente #nomeCliente').val('');
    $('#formAltCliente #documentoCliente').val('');
    $('.opcoesConfirmacao').css('display', 'none');
    FecharModal('#AlteraCliente');
});

$(document).on('click', '.btnExcluirCliente', function (e) {
    $('#ExcluirCliente #id').val($(this).data("id"));
});

$(document).on('click', '.btnConfirmaExcluirCliente', function (e) {

    var vData = { id: $('#ExcluirCliente #id').val(), nome: 'excluir', documento: '0000000' };

    $.ajax({
        url: vUrlClientes,
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            carregarClientes();
            $(this).data("id", "");
            alertas('Cliente excluído com sucesso', '#ExcluirCliente', 'alert_sucess', 'true');
        },
        error: function (d) {
            alertas(d.responseJSON['msg'], '#ExcluirCliente', 'alert_danger');
        }
    }
    );
});

$(document).on('click', '#btnNaoConfirmaExcluirCliente', function (e) {
    FecharModal('#ExcluirCliente');
});

$(document).on('click', '#Cliente .btnDadosCliente', function (e) {
    var idDadosExibir = "#dadosSecao_" + $(this).data("id");
    $(idDadosExibir).css('display', 'block');
});