"use client";

import { TextField } from "#/components/Inputs";

export default function CompanyData() {
  return (
    <div className="max-w-[595px] bg-white-neutral-light-100 border border-white-neutral-light-300 rounded-[12px] p-6 mb-[64px] sm:mb-[100px]">
      <p className="text-white-neutral-light-900 font-medium leading-[18px] mb-3">
        Dados Empresariais
      </p>

      <form onSubmit={() => console.log("form")}>
        <div className="pb-2">
          <TextField
            label="Razão social"
            inputName="companyName"
            id="companyName"
            type="text"
            placeholder="Razão Social"
            onChange={() => console.log("Razão Social")}
            value="Razão social"
          />
        </div>

        <div className="py-2">
          <TextField
            label="CNPJ"
            inputName="cnpj"
            id="cnpj"
            type="text"
            placeholder="CNPJ"
            onChange={() => console.log("CNPJ")}
            value="CNPJ"
          />
        </div>

        <div className="py-2">
          <TextField
            label="Telefone"
            inputName="phone"
            id="phone"
            type="text"
            placeholder="Telefone"
            onChange={() => console.log("Telefone")}
            value="Telefone"
          />
        </div>

        <div className="py-2">
          <TextField
            label="CEP"
            inputName="cep"
            id="cep"
            type="text"
            placeholder="CEP"
            onChange={() => console.log("CEP")}
            value="CEP"
          />
        </div>

        <div className="py-2">
          <TextField
            label="Endereço"
            inputName="address"
            id="address"
            type="text"
            placeholder="Endereço"
            onChange={() => console.log("Endereço")}
            value="Endereço"
          />
        </div>

        <div className="py-2 flex flex-col sm:flex-row justify-center items-center">
          <div className="py-2 w-full sm:w-2/3 sm:pr-2">
            <TextField
              label="Bairro"
              inputName="neighborhood"
              id="neighborhood"
              type="text"
              placeholder="Bairro"
              onChange={() => console.log("Bairro")}
              value="Bairro"
            />
          </div>
          <div className="py-2 w-full sm:w-1/3">
            <TextField
              label="UF"
              inputName="state"
              id="state"
              type="text"
              placeholder="UF"
              onChange={() => console.log("UF")}
              value="UF"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center pb-2">
          <div className="py-2 sm:py-0 w-full sm:w-1/3 sm:pr-2">
            <TextField
              label="Número"
              inputName="number"
              id="number"
              type="text"
              placeholder="Número"
              onChange={() => console.log("Number")}
              value="Bairro"
            />
          </div>
          <div className="py-2 sm:py-0 w-full sm:w-2/3">
            <TextField
              label="Complemento"
              inputName="additionalAddress"
              id="additionalAddress"
              type="text"
              placeholder="Complemento"
              onChange={() => console.log("complemento")}
              value="Complemento"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
