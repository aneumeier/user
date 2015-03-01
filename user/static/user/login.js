var signInCallback = function (result) {
    if (result['error']) {
        alert('An error happened:', result['error']);
    } else {
        $('#code').attr('value', result['code']);
        $('#at').attr('value', result['access_token']);
        $('#google-plus').submit();
    }
};

var modalDialog = function (modalId, modalLinkName, submitHandler) {
    var $modal;
    
    $modal = $(modalId).modal({show: false});
    
    $modal.on('click', '.btn-primary', submitHandler || function (event) {
        event.preventDefault();
        $modal.find('form').submit();
    });

    if (modalLinkName) {
        $('a[name="' + modalLinkName + '"]').on('click', function (event) {
            event.preventDefault();
            $modal.modal('toggle');
        });
    }
    return $modal;
};

$(function () {
    var $validationModal, $emailRequired;
    
    modalDialog('#livejournal-modal', 'livejournal');
    modalDialog('#openid-modal', 'openid');
    modalDialog('#email-modal', 'email');
    modalDialog('#username-modal', 'username');
    $validationModal = modalDialog('#validation-sent-modal');
    $emailRequired = modalDialog('#email-required-modal');
    
    modalDialog('#ajax-login-modal', 'ajax-login', function (event) {
        var $backend, $accessToken, $accessTokenSecret, $fields, $result;
        event.preventDefault();

        $modal = $(this).closest('.modal');
        $form = $modal.find('form');
        $backend = $modal.find('[name="backend"]');
        $accessToken = $modal.find('[name="access_token"]');
        $accessTokenSecret = $modal.find('[name="access_token_secret"]');
        $result = $modal.find('.login-result');

        $.get('/ajax-auth/' + $backend.val() + '/', {
            access_token: $accessToken.val(),
            access_token_secret: $accessTokenSecret.val(),
        }, function (data, xhr, response) {
            $result.find('.user-id').html(data.id);
            $result.find('.user-username').html(data.username);
            $form.hide();
            $result.show();
            setTimeout(function () { window.location = '/'; }, 10000);
        }, 'json')
    });
    
    modalDialog('#persona-modal', 'persona', function (event) {
        var $form;
        event.preventDefault();

        $form = $(this).closest('form');
        navigator.id.get(function (assertion) {
            if (assertion) {
                $form.find('[name="assertion"]').val(assertion)
            $form.submit();
            } else {
                alert('An error occurred while getting your assertion, try again.');
            }
        });
    });
    
    $('.disconnect-form').on('click', 'a.btn', function (event) {
        event.preventDefault();
        $(event.target).closest('form').submit();
    });

    {% if validation_sent %}
    $validationModal.modal('show');
    {% endif %}

    {% if email_required %}
    $emailRequired.modal('show');
    {% endif %}
});


