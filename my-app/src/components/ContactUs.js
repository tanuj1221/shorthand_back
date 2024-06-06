import React from 'react';
import styled from 'styled-components';

const ContactUsWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 1rem;
`;

const Link = styled.a`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function ContactUs() {
  return (
    <ContactUsWrapper>
      <Heading>CONTACT US</Heading>
      <Paragraph>
        In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:
      </Paragraph>
      <Paragraph>
        THE AARAL PUBLICATIONS<br />
        C/O Aaral Publications, Majiwada, Thane - W<br />
        Thane, Maharashtra 400601<br />
        India<br />
        Phone: 9869380948<br />
        <Link href="mailto:Aaral.publications@gmail.com">Aaral.publications@gmail.com</Link>
      </Paragraph>
    </ContactUsWrapper>
  );
}

export default ContactUs;