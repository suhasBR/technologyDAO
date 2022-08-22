import React from "react";

function Footer() {
  return (
    <div className="flex flex-col items-center py-8 py-8 mt-32 shadow">
      <h2 className="text-green-700">
      &#128151;We are working continuosly to make this better and we'd love to hear feedback from you &#128151;
      </h2>
      <h2 className="my-2">
        &#x270F;Write to us at <a className="text-blue-400"
        href="mailto:someone@example.com">support@technologydao.xyz</a>
      </h2>
      <div className="flex flex-row justify-center">
        &#169; TechnologyDAO
      </div>
    </div>
  );
}

export default Footer;
