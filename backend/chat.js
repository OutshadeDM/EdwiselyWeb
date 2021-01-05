(function(){
  
    var chat = {
      messageToSend: '',
      messageResponses: [
        'Why did the web developer leave the restaurant? Because of the table layout.',
        'How do you comfort a JavaScript bug? You console it.',
        'An SQL query enters a bar, approaches two tables and asks: "May I join you?"',
        'What is the most used language in programming? Profanity.',
        'What is the object-oriented way to become wealthy? Inheritance.',
        'An SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer, alcohol'
      ],
      init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.render();
      },
      cacheDOM: function() {
        this.$chatHistory = $('.chat-history');
        this.$button = $('button');
        this.$textarea = $('#message-to-send');
        this.$chatHistoryList =  this.$chatHistory.find('ul');
      },
      sendComment: function (id, message, type='Notification') {
        return new Promise((resolve, reject) => {
            try {
                var form = new  FormData();
                form.append(`${type.toLowerCase()}_id`, id);
                form.append(`comment`, message);
                $.ajax({
                    url: `https://stagingfacultypython.edwisely.com/${type}/Comment`,
                    type: 'POST',
                    dateType: 'json',
                    contentType: false,
                    headers: {
                        'Authorization': `Bearer ${$user.token}`
                    },
                    data: form,
                    processData: false,
                    success: function (result) {
                        // alert(result.status);
                        console.log(result);
                        if (result.status == 200) {
                            let total = Number($(`a[data-target="#comments"][data-id="${id}"]`).text().split(' ')[1]);
                            $(`a[data-target="#comments"][data-id="${id}"]`).text(` ${++total} comments`);
                            $('#comments').animate({ scrollTop: $('#comments .modal-content').height() }, 'slow');
                            resolve(false, result);
                        } else {
                            reject(true)
                        }
                    },
                    error: function (error) {
                        console.log(error);
                        reject(error);
                    }
                });	
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
      },
      bindEvents: function() {
        this.$button.on('click', this.addMessage.bind(this));
        this.$textarea.on('keyup', this.addMessageEnter.bind(this));
      },
      render: async function() {
        this.scrollToBottom();
        if (this.messageToSend.trim() !== '') {
          var template = Handlebars.compile( $("#message-template").html());
          var context = { 
            messageOutput: this.messageToSend,
            time: jQuery.timeago(new Date())
          };
          var type = $('.modal-body .chat .chat-history input#type').val();
          var id = $('.modal-body .chat .chat-history input#id').val();
          console.log(type);
          try {
            var result = await this.sendComment(id, this.messageToSend, type);
            this.$chatHistoryList.append(template(context));
          
            this.scrollToBottom();
            this.$textarea.val('');
          } catch (error) {
              console.log(error);
          }
          
          // responses
        //   var templateResponse = Handlebars.compile( $("#message-response-template").html());
        //   var contextResponse = { 
        //     response: this.getRandomItem(this.messageResponses),
        //     time: this.getCurrentTime()
        //   };
          
          setTimeout(function() {
            // this.$chatHistoryList.append(templateResponse(contextResponse));
            this.scrollToBottom();
          }.bind(this), 1500);
          
        }
        
      },
      
      addMessage: function() {
        this.messageToSend = this.$textarea.val()
        this.render();         
      },
      addMessageEnter: function(event) {
          // enter was pressed
          if (event.keyCode === 13) {
            this.addMessage();
          }
      },
      scrollToBottom: function() {
         this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
      },
      getCurrentTime: function() {
        return new Date().toLocaleTimeString().
                replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
      },
      getRandomItem: function(arr) {
        return arr[Math.floor(Math.random()*arr.length)];
      }
      
    };
    
    chat.init();    
  })();
  