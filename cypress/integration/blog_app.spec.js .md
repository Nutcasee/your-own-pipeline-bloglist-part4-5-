describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3001')
  })

  it('Login form is shown', function() {
    cy.visit('http://localhost:3001')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong credentials')
      cy.get('.error')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe.only('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })

      cy.contains('new blog').click()

      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('anyone')
      cy.get('#url').type('idk.com')
      cy.get('#create-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('a blog created by cypress')
    })

    it('user can like a blog', function() {
      cy.contains('view').click()
      cy.contains('like').click()

      cy.get('#like-button').parent().should('contain', '1')

    })

    it('user who created a blog can delete it', function() {
      cy.contains('view').click()
      cy.contains('remove').click()

      cy.get('html').should('contain', 'removed')
    })

    describe('other users cannot delete the blog', function() {
      beforeEach(function() {
        cy.contains('logout').click()

        const user = {
          name: 'Matti Luukkainen2',
          username: 'mluukkai2',
          password: 'salainen2'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3001')

        cy.login({ username: 'mluukkai2', password: 'salainen2' })
      })

      it('test it', function() {
        cy.contains('view').click()
        cy.contains('remove').click()

        cy.get('html').should('contain', 'a blog created by cypress')
        cy.contains('code 401')
        cy.get('.error')
          .and('have.css', 'color', 'rgb(255, 0, 0)')
          .and('have.css', 'border-style', 'solid')
        cy.contains('logout').click()

      })

    })

    describe('ordered according to likes', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          likes: 12 })
      })

      it('...with the blog with the most likes being first', function () {
        cy.get('[data-cy=view]').then( buttons => {
          cy.log('number of buttons', buttons.length)
          for (let i = 0; i < buttons.length; i++) {
            cy.wrap(buttons[i]).click()
          }

          for (let i = buttons.length - 1; i > 0; i--) {
            cy.log(`cy.get('[data-cy=likes]').eq(${i})  `, parseFloat(cy.get('[data-cy=likes]').eq(i)))
            cy.get('[data-cy=likes]').eq(i).then(($span) => {
              const likes = parseFloat($span.text())

              cy.get('[data-cy=likes]').eq(i-1).then(($span) => {
                const likes2 = parseFloat($span.text())
                expect(likes).be.lessThan(likes2)
              })
            })
          }
        })


        /*
          cy.log(`cy.get('[data-cy=likes]').eq(i)  `, cy.get('[data-cy=likes]').eq(i).invoke('text').then(parseFloat))

          for (let i = buttons.length - 1; i > 0; i--) {
            cy.get('[data-cy=likes]').eq(i).should('lessThan', cy.get('[data-cy=likes]').eq(i - 1))
          }


          for (let i = buttons.length - 1; i > 0; i--) {
            cy.get('[data-cy=like]').eq(i).parent().should((a) => {
              //const x = a.text()[0]

              cy.get('[data-cy=like]').eq(i-1).parent().should((b) => {
                //const y = b.text()[0]
                //cy.log('x & y ', x, y)
                a.text()[0].should('be.lessThan', b.text()[0])
              })

            })
          }
          for (let i = buttons.length - 1; i >= 0; i--) {
            cy.get('[data-cy=like]').eq(i).parent().should((a) => {
              cy.log('a.text()[0]  ', a.text())

            })

          }
        cy.get('[data-cy=like]').eq(i).parent().as(`theValue${i}`)
        cy.get(`theValue${i}`).should('')

        cy.get('[data-cy=view]').eq(1).click()
          .then(
            cy.get('[data-cy=like]').eq(1).click()

          )

        cy.get('#like-button').parent().should('contain', '11')

        cy.get('html').should('have', 'view').then( buttons => {
          // const length = buttons.length
          cy.log('number of buttons', buttons.length)
          for (let i = 0; i < buttons.length; i++) {
            cy.wrap(buttons[i]).click()
          }

        })

        cy.get('button').then( buttons => {
          console.log('number of buttons', buttons.length)
          cy.wrap(buttons[0]).click()
        })

        cy.contains('second note').parent().find('button').click().as('theButton')
        cy.contains('second note').parent().find('button').should('contain', 'make not important')

        cy.contains('Canonical string reduction')
        */
      })
    })
  })
})

/*
describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
  })

  it('user can log in', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')
  })

  it('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')
    cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()

      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })

      it('it can be made important', function () {
        cy.contains('second note').parent().find('button').as('theButton')
        cy.get('@theButton').click()
        cy.get('@theButton').should('contain', 'make not important')
      })
    })
  })
})
*/