var vUrlSecoes = "http://127.0.0.1:5000/Secao";
var vUrlProdutos = "http://127.0.0.1:5000/Produtos";

$(document).ready(function (e) {
    carregarSecoes();
    carregarProdutos();
});

function carregarSecoes() {
    $.ajax({
        url: vUrlSecoes,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        success: function (data) {
            var sel = $("#Secoes");
            sel.empty();
            data['Secoes'].forEach(e => {
                sel.append('<div class="container"><div class="row linha"><div class="row colunaSemPadding"><span class="NomeSecaoProduto">' + e.nome + '</span></div><div class="row"><div class="col colunaSemPadding"><button class="btn btn-warning btnAlterarSecao linhaBotao" data-bs-toggle="modal" data-bs-target="#AlteraSecao" id="Alterar" data-id="' + e.id + '" data-nome="' + e.nome + '">Alterar</button></div><div class="col colunaSemPadding"><button class="btn btn-danger btnExcluirSecao linhaBotao" data-bs-toggle="modal" data-bs-target="#ExcluirSecao" data-id="' + e.id + '">Excluir</button></div></div><div class="row dados" id="dadosSecao_' + e.id + '"><span>dados</span></div></div></div>')

            });
            alimentarSelectsSecao();
        },
        error: function () {
            console.log("Ocorreu um erro: " + dataType);
        }
    });
}

function carregarProdutos() {
    $.ajax({
        url: vUrlProdutos,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        success: function (data) {
            var sel = $("#Produtos");
            sel.empty();
            data['Produtos'].forEach(e => {
                sel.append('<div class="container"><div class="row linha"><div class="col colunaSemPadding"><span class="NomeSecaoProduto">' + e.nome + '</span></div><div class="row"><div class="col colunaSemPadding"><button class="btn btn-warning btnAlterarProduto linhaBotao" data-bs-toggle="modal" data-bs-target="#AlteraProduto" id="Alterar" data-id="' + e.id + '" data-nome="' + e.nome + '" data-secao="' + e.idSecao + '" data-preco="' + e.preco + '">Alterar</button></div><div class="col colunaSemPadding"><button class="btn btn-danger btnExcluirProduto linhaBotao" data-bs-toggle="modal" data-bs-target="#ExcluirProduto" data-id="' + e.id + '">Excluir</button></div></div><div class="row dados" id="dadosProduto_' + e.id + '"><span>dados</span></div></div></div>')
            });
        },
        error: function () {
            console.log("Ocorreu um erro: " + dataType);
        }
    });
}

function alimentarSelectsSecao() {
    $.ajax({
        url: vUrlSecoes,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        success: function (data) {
            var sel = $("#listSecao");
            var selAlt = $("#listAltSecao");
            sel.empty();
            selAlt.empty();
            data['Secoes'].forEach(e => {
                sel.append('<option value="' + e.id + '">' + e.nome + '</option>');
                selAlt.append('<option value="' + e.id + '">' + e.nome + '</option>');
            });
        },
        error: function () {
            console.log("Ocorreu um erro: " + dataType);
        }
    }
    );
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

$('#btnCadSecao').on('click', function (e) {

    if (($("#formCadSecao #nomeSecao").val() == "") || ($("#formCadSecao #nomeSecao").val().length <= 3)) {
        alertas('O nome da seção precisa ter mais de 3 caractéres', '#modCadSecao', 'alert_danger');
        return;
    }
    var vData = { nome: $("#formCadSecao #nomeSecao").val() };

    $.ajax({
        url: vUrlSecoes,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            carregarSecoes();
            alimentarSelectsSecao();
            $('#formCadSecao #nomeSecao').val("")
            alertas('Seção cadastrada com sucesso', '#modCadSecao', 'alert_sucess');
        },
        error: function (d) {
            alertas(d.responseJSON['msg'], '#modCadSecao', 'alert_danger');
        }
    }
    );
});

$(document).on('click', '.btnAlterarSecao', function (e) {
    $('#formAltSecao #nomeSecao').val($(this).data("nome"));
    $('#formAltSecao #id').val($(this).data("id"));
    $('.opcoesConfirmacao').css('display', 'none');
});

$(document).on('click', '#exibConfirmaAlteracaoSecao', function (e) {
    $('.opcoesConfirmacao').css('display', 'flex');
});

$(document).on('click', '#btnConfirmaAlteracaoSecao', function (e) {

    if (($("#formAltSecao #nomeSecao").val() == "") || ($("#formAltSecao #nomeSecao").val().length <= 3)) {
        alertas('O nome da seção precisa ter mais de 3 caractéres', '#AlteraSecao', 'alert_danger');
        return;
    }

    var vData = {
        id: $('#formAltSecao #id').val(),
        nome: $('#formAltSecao #nomeSecao').val()
    };
    $.ajax({
        url: vUrlSecoes,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            carregarSecoes();
            $('#formAltSecao #id').val('');
            $('#formAltSecao #nomeSecao').val('');
            $('.opcoesConfirmacao').css('display', 'none');

            alertas('Seção atualizada com sucesso', '#AlteraSecao', 'alert_sucess', 'true');
        },
        error: function (d) {
            alertas(d.responseJSON['msg'], '#AlteraSecao', 'alert_danger');

            $('.opcoesConfirmacao').css('display', 'none');
        }
    }
    );
});

$(document).on('click', '#btnNaoConfirmaAlteracaoSecao', function (e) {
    $('#formAltSecao #id').val('');
    $('#formAltSecao #nomeSecao').val('');
    $('.opcoesConfirmacao').css('display', 'none');
    FecharModal('#AlteraSecao');
});

$(document).on('click', '.btnExcluirSecao', function (e) {
    $('#ExcluirSecao #id').val($(this).data("id"));
});

$(document).on('click', '.btnConfirmaExcluirSecao', function (e) {

    var vData = { id: $('#ExcluirSecao #id').val(), nome: 'excluir' };

    $.ajax({
        url: vUrlSecoes,
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            carregarSecoes();
            $(this).data("id", "");
            alertas('Seção excluída com sucesso', '#ExcluirSecao', 'alert_sucess', 'true');
        },
        error: function (d) {
            alertas(d.responseJSON['msg'], '#ExcluirSecao', 'alert_danger');
        }
    }
    );
});

$(document).on('click', '#btnNaoConfirmaExcluirSecao', function (e) {
    FecharModal('#ExcluirSecao');
});

$(document).on('click', '#Secoes .btnDadosSecao', function (e) {
    var idDadosExibir = "#dadosSecao_" + $(this).data("id");
    $(idDadosExibir).css('display', 'block');
});

//produto
$('#btnCadProduto').on('click', function (e) {

    if (($("#formCadProduto #nomeProduto").val() == "") || ($("#formCadProduto #nomeProduto").val().length <= 3)) {
        alertas('O nome do produto precisa ter mais de 3 caractéres', '#modCadProduto', 'alert_danger');
        return;
    }

    if (($("#formCadProduto #listSecao").val() == "") || ($("#formCadProduto #listSecao").val() == null)) {
        alertas('A seção do produto deve ser selecionada', '#modCadProduto', 'alert_danger');
        return;
    }

    if (($("#formCadProduto #precoProduto").val() == "") || ($("#formCadProduto #precoProduto").val().length < 1)) {
        alertas('O preço do produto deve ser informado', '#modCadProduto', 'alert_danger');
        return;
    }

    var vData = {
        nome: $("#formCadProduto #nomeProduto").val(),
        idSecao: $("#formCadProduto #listSecao").val(),
        preco: $("#formCadProduto #precoProduto").val()
    };

    $.ajax({
        url: vUrlProdutos,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            carregarProdutos();
            $("#formCadProduto #nomeProduto").val('');
            $("#formCadProduto #listSecao").val('');
            $("#formCadProduto #precoProduto").val('');
            alertas('Produto cadastrado com sucesso', '#modCadProduto', 'alert_sucess');
        },
        error: function (d) {
            alertas(d.responseJSON['msg'], '#modCadProduto', 'alert_danger');
        }
    }
    );
});
//btnFiltroProduto

$('#btnFiltroSecao').on('click', function (e) {

    if (($("#formFiltrarSecao #nomeSecaoFiltro").val() == "") || ($("#formFiltrarSecao #nomeSecaoFiltro").val().length <= 3)) {
        alertas('O nome da seção precisa ter mais de 3 caractéres', '#modFiltroSecao', 'alert_danger');
        return;
    }

    var vData = {
        nome: $("#formFiltrarSecao #nomeSecaoFiltro").val(),
        id: 0
    };

    $.ajax({
        url: "http://localhost:5000/BuscarSecao",
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            var sel = $("#Secoes");
            sel.empty();
            d['Secoes'].forEach(e => {
                sel.append('<div class="container"><div class="row linha"><div class="row colunaSemPadding"><span class="NomeSecaoProduto">' + e.nome + '</span></div><div class="row"><div class="col colunaSemPadding"><button class="btn btn-warning btnAlterarSecao linhaBotao" data-bs-toggle="modal" data-bs-target="#AlteraSecao" id="Alterar" data-id="' + e.id + '" data-nome="' + e.nome + '">Alterar</button></div><div class="col colunaSemPadding"><button class="btn btn-danger btnExcluirSecao linhaBotao" data-bs-toggle="modal" data-bs-target="#ExcluirSecao" data-id="' + e.id + '">Excluir</button></div></div><div class="row dados" id="dadosSecao_' + e.id + '"><span>dados</span></div></div></div>')

            });
        },
        error: function () {
            console.log("Ocorreu um erro: " + dataType);
        }
    }
    );
});

$('#btnFiltroProduto').on('click', function (e) {
    console.log("sdsdsds");
    if (($("#formFiltraProduto #nomeProdutoFiltro").val() == "") || ($("#formFiltraProduto #nomeProdutoFiltro").val().length <= 3)) {
        alertas('O nome do produto precisa ter mais de 3 caractéres', '#modFiltraProduto', 'alert_danger');
        return;
    }

    var vData = {
        nome: $("#formFiltraProduto #nomeProdutoFiltro").val(),
        id: 0,
        idSecao: 0,
        preco: 0
    };

    $.ajax({
        url: "http://localhost:5000/BuscaProdutos",
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            var sel = $("#Produtos");
            sel.empty();
            d['Produtos'].forEach(e => {
                sel.append('<div class="container"><div class="row linha"><div class="col colunaSemPadding"><span class="NomeSecaoProduto">' + e.nome + '</span></div><div class="row"><div class="col colunaSemPadding"><button class="btn btn-warning btnAlterarProduto linhaBotao" data-bs-toggle="modal" data-bs-target="#AlteraProduto" id="Alterar" data-id="' + e.id + '" data-nome="' + e.nome + '" data-secao="' + e.idSecao + '" data-preco="' + e.preco + '">Alterar</button></div><div class="col colunaSemPadding"><button class="btn btn-danger btnExcluirProduto linhaBotao" data-bs-toggle="modal" data-bs-target="#ExcluirProduto" data-id="' + e.id + '">Excluir</button></div></div><div class="row dados" id="dadosProduto_' + e.id + '"><span>dados</span></div></div></div>')
            });
        },
        error: function () {
            console.log("Ocorreu um erro: " + dataType);
        }
    }
    );
});

$(document).on('click', '.btnAlterarProduto', function (e) {
    $('#formAltProduto #nomeProduto').val($(this).data("nome"));
    $('#formAltProduto #id').val($(this).data("id"));
    $('#formAltProduto #precoProduto').val($(this).data("preco"));
    $('#formAltProduto #listAltSecao').val($(this).data("secao"));
});

$(document).on('click', '#exibConfirmaAlteracaoProduto', function (e) {
    $('.opcoesConfirmacao').css('display', 'flex');
});

$(document).on('click', '#btnConfirmaAlteracaoProduto', function (e) {

    if (($("#formAltProduto  #nomeProduto").val() == "") || ($("#formAltProduto  #nomeProduto").val().length <= 3)) {
        alertas('O nome do produto precisa ter mais de 3 caractéres', '#AlteraProduto', 'alert_danger');
        return;
    }

    if (($("#formAltProduto  #listAltSecao").val() == "") || ($("#formAltProduto  #listAltSecao").val() == null)) {
        alertas('A seção do produto deve ser selecionada', '#AlteraProduto', 'alert_danger');
        return;
    }

    if (($("#formAltProduto  #precoProduto").val() == "") || ($("#formAltProduto  #precoProduto").val().length < 1)) {
        alertas('O preço do produto deve ser informado', '#AlteraProduto', 'alert_danger');
        return;
    }

    var vData = {
        id: $('#formAltProduto #id').val(),
        nome: $('#formAltProduto #nomeProduto').val(),
        idSecao: $('#formAltProduto #listAltSecao').val(),
        preco: $('#formAltProduto #precoProduto').val()
    };
    $.ajax({
        url: vUrlProdutos,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            carregarProdutos();
            $('#formAltProduto #id').val('');
            $('#formAltProduto #listAltSecao').val('');
            $('#formAltProduto #nomeProduto').val('');
            $('#formAltProduto #precoProduto').val('');
            $('.opcoesConfirmacao').css('display', 'none');

            alertas('Produto atualizado com sucesso', '#AlteraProduto', 'alert_sucess', 'true');
        },
        error: function (d) {

            alertas(d.responseJSON['msg'], '#AlteraProduto', 'alert_danger');
        }
    }
    );
});

$(document).on('click', '#btnNaoConfirmaAlteracaoProduto', function (e) {
    $('#formAltProduto #id').val('');
    $('#formAltProduto #listAltSecao').val('');
    $('#formAltProduto #nomeProduto').val('');
    $('#formAltProduto #precoProduto').val('');
    $('.opcoesConfirmacao').css('display', 'none');
    FecharModal('#AlteraProduto');
});

$(document).on('click', '.btnExcluirProduto', function (e) {
    $('#ExcluirProduto #id').val($(this).data("id"));
});

$(document).on('click', '.btnConfirmaExcluirProduto', function (e) {
    var vData = {
        id: $('#ExcluirProduto #id').val(),
        nome: 'excluir',
        idSecao: 'excluir',
        preco: 'excluir'
    };
    $.ajax({
        url: vUrlProdutos,
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            carregarProdutos();
            $(this).data("id", "");
            alertas('Produto excluído com sucesso', '#ExcluirProduto', 'alert_sucess', 'true');
        },
        error: function (d) {
            alertas(d.responseJSON['msg'], '#ExcluirProduto', 'alert_danger');
        }
    }
    );
});

$(document).on('click', '#btnNaoConfirmaExcluirProduto', function (e) {
    FecharModal('#ExcluirProduto');
});

$(document).on('click', '#Produtos .btnDadosProduto', function (e) {
    var idDadosExibir = "#dadosProduto_" + $(this).data("id");
    $(idDadosExibir).css('display', 'block');
});


