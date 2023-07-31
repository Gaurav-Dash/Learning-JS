import React from "react";
import Layout from "../components/Layout";

const contact = () => {
  return (
    <Layout>
      <main class="page">
        <section class="contact-page">
          <article class="contact-info">
            <h3>Want to get in touch?</h3>
            <p>
              Whatever kinfolk affogato, man bun four dollar toast swag
              sartorial narwhal hashtag af scenester. Ethical next level 90's,
              chartreuse cornhole keffiyeh meditation vibecession hella.
              Fingerstache cronut grailed kickstarter quinoa. Portland
              microdosing affogato cronut kinfolk, echo park shaman. VHS
              portland farm-to-table vibecession butcher taxidermy vegan
              authentic mustache brunch hoodie tattooed.
            </p>
            <p>
              Whatever kinfolk affogato, man bun four dollar toast swag
              sartorial narwhal hashtag af scenester. Ethical next level 90's,
              chartreuse cornhole keffiyeh meditation vibecession hella.
            </p>
          </article>
          <article>
            <form class="form contact-form">
              <div class="form-row">
                <label for="">Your name</label>
                <input type="text" id="name" name="name" />
              </div>
              <div class="form-row">
                <label for="">Your mail</label>
                <input type="text" id="mail" name="mail" />
              </div>
              <div class="form-row">
                <label for="">Message</label>
                <textarea type="text" id="message" name="message" />
              </div>
              <button type="submit" className="btn block">
                Submit
              </button>
            </form>
          </article>
        </section>
      </main>
    </Layout>
  );
};

export default contact;
