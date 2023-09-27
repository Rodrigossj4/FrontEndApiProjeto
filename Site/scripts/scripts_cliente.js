var vUrlClientes = "http://127.0.0.1:5001/Cliente";
var vUrlEnderecos = "http://127.0.0.1:5001/Endereco";


$(document).ready(function (e) {
    var query = location.search.slice(1);
    if (query.split("=")[1] != undefined) {
        carregarClientesBusca(query.split("=")[1], "");
        alimentarEnderecos(query.split("=")[1], "");
    } else {

        carregarClientes();
    }

    $("#documentoCliente").mask('000.000.000-00', { reverse: true });
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
                sel.append('<div class="container"><div class="row linha"><div class="row colunaSemPadding"><a class="linkCliente" href="/clientePerfil.html?idCliente=' + e.id + '"><span class="NomeCliente">' + e.nome + '</span></a></div></div></div><div class="row dados" id="dadosCliente_' + e.id + '"><span>dados</span></div></div></div>')
                //alimentarEnderecos(e.id)
            });
            // alimentarSelectsSecao();
        },
        error: function () {
            console.log("Ocorreu um erro: " + dataType);
        }
    });
}

function carregarClientesBusca(id, nome) {
    var vData
    if (nome != "") {
        vData = {
            nome: nome,
            id: 0,
            documento: ""
        };
    } else {
        vData = {
            nome: "",
            id: id,
            documento: ""
        };
    }

    $.ajax({
        url: "http://localhost:5001/BuscarCliente",
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            var sel = $("#Clientes");
            sel.empty();
            if (nome != "") {
                d['Clientes'].forEach(e => {
                    sel.append('<div class="container"><div class="row linha"><div class="row colunaSemPadding"><a class="linkCliente" href="/clientePerfil.html?idCliente=' + e.id + '"><span class="NomeCliente">' + e.nome + '</span></a></div></div></div><div class="row dados" id="dadosCliente_' + e.id + '"><span>dados</span></div></div></div>')
                    //alimentarEnderecos(e.id)
                });
            } else {
                d['Clientes'].forEach(e => {
                    sel.append('<div class="container"><div class="row linha"><div class="row colunaSemPadding linkCliente"><span class="NomeCliente"> -Nome: ' + e.nome + '</span><span class="DocumentoCliente"> -Documento: ' + e.documento + '</span></div><div class="row"><div class="col colunaSemPadding"><button class="btn btn-warning btnAlterarCliente linhaBotao" data-bs-toggle="modal" data-bs-target="#AlteraCliente" id="Alterar" data-id="' + e.id + '" data-nome="' + e.nome + '" data-documento="' + e.documento + '">Alterar</button></div><div class="col colunaSemPadding"><button class="btn btn-danger btnExcluirCliente linhaBotao" data-bs-toggle="modal" data-bs-target="#ExcluirCliente" data-id="' + e.id + '">Excluir</button></div></div><div class="row dados" id="dadosCliente_' + e.id + '"><span>dados</span></div></div></div>')
                    //alimentarEnderecos(e.id)

                });
            }
        },
        error: function () {
            console.log("Ocorreu um erro: " + dataType);
        }
    }
    );
}

function alimentarEnderecos(id, bairro) {
    var vData = { bairro: bairro, idCliente: id, cep: "", cidade: "", complemento: "", estado: "", id: 0, logradouro: "", numero: "" };

    $.ajax({
        url: 'http://localhost:5001/BuscarEndereco',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        data: JSON.stringify(vData),
        success: function (data) {
            var sel = $("#Enderecos");
            sel.empty();
            data['Enderecos'].forEach(e => {
                sel.append('<div class="container"><div class="row linha"><div class="row colunaSemPadding"><span class="BairroCliente">' + e.bairro + '</span><span class="LogradouroCliente"> - ' + e.logradouro + ', número: ' + e.numero + ', cidade: ' + e.cidade + ', estado: ' + e.estado + '</span></div><div class="row"><div class="col colunaSemPadding"><button class="btn btn-warning btnAlterarEndereco linhaBotao" data-bs-toggle="modal" data-bs-target="#AlteraEndereco" id="Alterar" data-id="' + e.id + '" data-logradouro="' + e.logradouro + '" data-bairro="' + e.bairro + '" data-cep="' + e.cep + '" data-id="' + e.id + '" data-cidade="' + e.cidade + '" data-estado="' + e.estado + '" data-numero="' + e.numero + '" data-complemento="' + e.complemento + ' ">Alterar</button></div><div class="col colunaSemPadding"><button class="btn btn-danger btnExcluirEndereco linhaBotao" data-bs-toggle="modal" data-bs-target="#ExcluirEndereco" data-id="' + e.id + '">Excluir</button></div></div><div class="row dados" id="dadosEndereco_' + e.id + '"><span>dados</span></div></div></div>')
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

$('#btnCadCliente').on('click', function (e) {

    if (($("#formCadCliente #nomeCliente").val() == "") || ($("#formCadCliente #nomeCliente").val().length <= 2)) {
        alertas('O nome do cliente precisa ter mais de 3 caractéres', '#modCadCliente', 'alert_danger');
        return;
    }
    var cpf = $("#formCadCliente #documentoCliente").val().replaceAll('.', '');
    cpf = cpf.replaceAll('-', '');

    var vDoc = { documento: cpf };

    $.ajax({
        url: 'http://localhost:5009/ValidarCPF',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vDoc),
        success: function (d) {

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
                    $('#formCadCliente #documentoCliente').val("")
                    alertas('Cliente cadastrado com sucesso', '#modCadCliente', 'alert_sucess');
                },
                error: function (d) {
                    console.log(d);
                    alertas(d.responseJSON['msg'], '#modCadCliente', 'alert_danger');
                }
            }
            );
        },
        error: function (d) {
            console.log(d);
            alertas(d.responseJSON['msg'], '#modCadCliente', 'alert_danger');
        }
    });


});
//btnCadEndCliente

$('#CadastrarEndereco').on('click', function (e) {

    var vData = {
        idCliente: location.search.slice(1).split("=")[1],
        cep: $("#formCadEndCliente #cep").val(),
        logradouro: $("#formCadEndCliente #logradouro").val(),
        bairro: $("#formCadEndCliente #bairro").val(),
        estado: $("#formCadEndCliente #estado").val(),
        cidade: $("#formCadEndCliente #cidade").val(),
        complemento: $("#formCadEndCliente #complemento").val(),
        numero: $("#formCadEndCliente #numero").val()
    };

    $.ajax({
        url: vUrlEnderecos,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            $("#formCadEndCliente #cep").val("");
            $("#formCadEndCliente #logradouro").val("");
            $("#formCadEndCliente #bairro").val("");
            $("#formCadEndCliente #estado").val("");
            $("#formCadEndCliente #cidade").val("");
            $("#formCadEndCliente #complemento").val("");
            $("#formCadEndCliente #numero").val("");

            alimentarEnderecos(location.search.slice(1).split("=")[1], "")
            alertas('Endereço cadastrado com sucesso', '#CadastrarEnderecoCliente', 'alert_sucess');
        },
        error: function (d) {
            console.log(d);
            alertas('Endereco atualizado com sucesso', '#modCadEndCliente', 'alert_danger');
        }
    }
    );
});

$('#cep').on('blur', function (e) {
    if (($("#formCadEndCliente #cep").val() != "") || ($("#formCadEndCliente #cep").val().length >= 8)) {

    }

    $.ajax({
        url: 'http://localhost:5009/ConsultarCEP/' + $("#formCadEndCliente #cep").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        //data: JSON.stringify(vData),
        success: function (d) {
            $('#formCadEndCliente #logradouro').val(d.logradouro);
            $('#formCadEndCliente #bairro').val(d.bairro);
            $('#formCadEndCliente #cidade').val(d.localidade);
            $('#formCadEndCliente #estado').val(d.uf);
        },
        error: function (d) {
            $('#formCadEndCliente #logradouro').val('');
            $('#formCadEndCliente #bairro').val('');
            $('#formCadEndCliente #cidade').val('');
            $('#formCadEndCliente #estado').val('');
            $("#formCadEndCliente #complemento").val("");
            $("#formCadEndCliente #numero").val("");
            alertas("Cep não encontrado", '#modCadCliente', 'alert_danger');
        }
    });
});

$(document).on('click', '.btnAlterarCliente', function (e) {
    $('#formAltCliente #nomeCliente').val($(this).data("nome"));
    $('#formAltCliente #id').val($(this).data("id"));
    $('#formAltCliente #documentoCliente').val($(this).data("documento"));
    $('.opcoesConfirmacao').css('display', 'none');
});

$(document).on('click', '.btnAlterarEndereco', function (e) {
    $('#formAltEnd #cep').val($(this).data("cep"));
    $('#formAltEnd #id').val($(this).data("id"));
    $('#formAltEnd #bairro').val($(this).data("bairro"));
    $('#formAltEnd #logradouro').val($(this).data("logradouro"));
    $('#formAltEnd #cidade').val($(this).data("cidade"));
    $('#formAltEnd #estado').val($(this).data("estado"));
    $('#formAltEnd #numero').val($(this).data("numero"));
    $('#formAltEnd #complemento').val($(this).data("complemento"));
    $('.opcoesConfirmacao').css('display', 'none');
});

$(document).on('click', '.btnCadEndCliente', function (e) {
    $('#formCadEndCliente #id').val($(this).data("id"));
});


$(document).on('click', '#exibConfirmaAlteracaoCliente', function (e) {
    $('.opcoesConfirmacao').css('display', 'flex');
});

$(document).on('click', '#exibConfirmaAlteracaoEndereco', function (e) {
    $('.opcoesConfirmacao').css('display', 'flex');
});


$(document).on('click', '#btnConfirmaAlteracaoEndereco', function (e) {

    if (($("#formAltEnd #cep").val() == "") || ($("#formAltEnd #cep").val().length <= 8)) {
        alertas('O cep do endereço precisa ter 8 caractéres', '#AlteraEndereco', 'alert_danger');
        return;
    }

    if (($("#formAltEnd #bairro").val() == "") || ($("#formAltEnd #bairro").val().length <= 2)) {
        alertas('O bairro precisa ter mais de 2 caractéres', '#AlteraEndereco', 'alert_danger');
        return;
    }

    if (($("#formAltEnd #logradouro").val() == "") || ($("#formAltEnd #logradouro").val().length <= 3)) {
        alertas('O logradouro precisa ter 3 caractéres', '#AlteraEndereco', 'alert_danger');
        return;
    }

    if (($("#formAltEnd #cidade").val() == "") || ($("#formAltEnd #cidade").val().length <= 3)) {
        alertas('A cidade precisa ter 3 caractéres', '#AlteraEndereco', 'alert_danger');
        return;
    }

    if (($("#formAltEnd #estado").val() == "") || ($("#formAltEnd #estado").val().length <= 1)) {
        alertas('O estado precisa ter 2 caractéres', '#AlteraEndereco', 'alert_danger');
        return;
    }

    if (($("#formAltEnd #numero").val() == "") || ($("#formAltEnd #numero").val().length <= 1)) {
        alertas('O número precisa ter 1 caractéres', '#AlteraEndereco', 'alert_danger');
        return;
    }

    var vData = {
        id: $("#formAltEnd #id").val(),
        idCliente: location.search.slice(1).split("=")[1],
        cep: $("#formAltEnd #cep").val(),
        logradouro: $("#formAltEnd #logradouro").val(),
        bairro: $("#formAltEnd #bairro").val(),
        estado: $("#formAltEnd #estado").val(),
        cidade: $("#formAltEnd #cidade").val(),
        complemento: $("#formAltEnd #complemento").val(),
        numero: $("#formAltEnd #numero").val()
    };

    $.ajax({
        url: vUrlEnderecos,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            alimentarEnderecos(location.search.slice(1).split("=")[1], "");
            $("#formAltEnd #id").val(''),
                $("#formAltEnd #cep").val(''),
                $("#formAltEnd #logradouro").val(''),
                $("#formAltEnd #bairro").val(''),
                $("#formAltEnd #estado").val(''),
                $("#formAltEnd #cidade").val(''),
                $("#formAltEnd #complemento").val(''),
                $("#formAltEnd #numero").val('')

            alertas('Endereco atualizado com sucesso', '#AlteraEndereco', 'alert_sucess', 'true');
        },
        error: function (d) {
            alertas(d.responseJSON['msg'], '#AlteraEndereco', 'alert_danger');

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

$(document).on('click', '.btnExcluirEndereco', function (e) {
    $('#ExcluirEndereco #id').val($(this).data("id"));
});

$(document).on('click', '.btnConfirmaExcluirEndereco', function (e) {

    var vData = {
        id: $('#ExcluirEndereco #id').val(),
        idCliente: 0,
        cep: '0000000',
        logradouro: '0000000',
        bairro: '0000000',
        estado: '0000000',
        cidade: '0000000',
        complemento: '0000000',
        numero: '0000000'
    };
    $.ajax({
        url: vUrlEnderecos,
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            alimentarEnderecos(location.search.slice(1).split("=")[1], "");
            $(this).data("id", "");
            alertas('Endereco excluído com sucesso', '#ExcluirEndereco', 'alert_sucess', 'true');
        },
        error: function (d) {
            alertas(d.responseJSON['msg'], '#ExcluirEndereco', 'alert_danger');
        }
    }
    );
});

$(document).on('click', '#btnNaoConfirmaExcluirEndereco', function (e) {
    FecharModal('#ExcluirEndereco');
});

$(document).on('click', '#Cliente .btnDadosCliente', function (e) {
    var idDadosExibir = "#dadosSecao_" + $(this).data("id");
    $(idDadosExibir).css('display', 'block');
});

$('#btnFiltroBairro').on('click', function (e) {

    if (($("#formFiltraBairro #bairroFiltro").val() == "") || ($("#formFiltraBairro #bairroFiltro").val().length <= 3)) {
        alertas('O nome do bairro precisa ter mais de 3 caractéres', '#modFiltraBairro', 'alert_danger');
        return;
    }
    console.log("d");
    alimentarEnderecos(location.search.slice(1).split("=")[1], $("#formFiltraBairro #bairroFiltro").val());
});


$('#btnFiltroCliente').on('click', function (e) {

    if (($("#formFiltraCliente #clienteFiltro").val() == "") || ($("#formFiltraCliente #clienteFiltro").val().length <= 3)) {
        alertas('O nome do cliente precisa ter mais de 3 caractéres', '#modfiltraCliente"', 'alert_danger');
        return;
    }
    carregarClientesBusca(0, $("#formFiltraCliente #clienteFiltro").val());
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
            carregarClientesBusca(location.search.slice(1).split("=")[1], "")
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


$(document).on('click', '.btnConfirmaExcluirCliente', function (e) {

    var vData = { id: $('#ExcluirCliente #id').val(), nome: 'excluir', documento: '0000000' };

    $.ajax({
        url: vUrlClientes,
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(vData),
        success: function (d) {
            $(this).data("id", "");
            alertas('Cliente excluído com sucesso', '#ExcluirCliente', 'alert_sucess', 'true');
            window.location = "/cliente.html";
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
