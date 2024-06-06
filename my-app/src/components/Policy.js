import React from 'react';
import styled from 'styled-components';

const PolicyWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 1rem;
`;

function Policy() {
  return (
    <PolicyWrapper>
      <Heading>Privacy Policy</Heading>
      <Paragraph>
        We do not share your Personal Information with any third party apart from financial institutions such as banks, RBI, or other regulatory agencies (as may be required) and to provide you with services that we offer through Razorpay, conduct quality assurance testing, facilitate the creation of accounts, provide technical and customer support, or provide specific services, such as synchronization of your contacts with other software applications, in accordance with your instructions. These third parties are required not to use your Personal Information other than to provide the services requested by you.
      </Paragraph>
      <Paragraph>
        By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in India. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in India, then through your continued use of the Services, you are transferring your data to India, and you expressly consent to have your data transferred to and processed in India.
      </Paragraph>
    </PolicyWrapper>
  );
}

export default Policy;