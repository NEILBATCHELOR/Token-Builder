import React, { useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, AlertCircle } from "lucide-react";
import ConfigurationSection from "./ConfigurationSection";
import MetadataEditor from "./MetadataEditor";
import TokenPreviewPanel from "./TokenPreviewPanel";
import TokenBlockForm from "./TokenBlockForm";
import TokenStandardGuide from "./TokenStandardGuide";
import { TokenBlock, TokenFormData } from "@/types/token";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tokenFormSchema, TokenFormValues } from "@/schemas/tokenFormSchema";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import ImportButton from "./ImportButton";

interface TokenConfigurationFormProps {
  onSubmit?: (data: TokenFormData) => void;
  initialData?: TokenFormData;
  onChange?: (data: TokenFormData) => void;
}

const TokenConfigurationForm = ({
  onSubmit = () => {},
  initialData = {
    name: "",
    symbol: "",
    decimals: 18,
    standard: "ERC20",
    metadata: {},
  },
  onChange = () => {},
}: TokenConfigurationFormProps) => {
  const defaultValues: TokenFormValues = {
    ...initialData,
    blocks: initialData.blocks || [
      {
        id: crypto.randomUUID(),
        name: "My Token",
        symbol: "MTK",
        standard: "ERC20",
        decimals: 18,
        totalSupply: 1000000,
        metadata: {
          mintable: true,
          burnable: false,
          pausable: false,
          transferRestrictions: false,
        },
      },
    ],
  };

  const methods = useForm<TokenFormValues>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
    reset,
  } = methods;

  const formData = watch();

  // Update parent component with form data changes
  useEffect(() => {
    // Generate contract preview for each block
    const updatedBlocks =
      formData.blocks?.map((block) => {
        try {
          const { generateContract } = require("@/lib/contractTemplates");
          return {
            ...block,
            contractPreview: generateContract(block),
          };
        } catch (error) {
          console.error("Error generating contract:", error);
          return block;
        }
      }) || [];

    // Update the form data with contract previews
    const updatedFormData = {
      ...formData,
      blocks: updatedBlocks,
      contractPreview: updatedBlocks[0]?.contractPreview || "",
    };

    onChange(updatedFormData);
  }, [formData, onChange]);

  const handleBasicDetailsChange = (field: keyof TokenFormData, value: any) => {
    setValue(field, value, { shouldValidate: true });
  };

  const handleMetadataChange = (name: string, value: any) => {
    setValue(`metadata.${name}`, value, { shouldValidate: true });
  };

  const onFormSubmit = (data: TokenFormValues) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Please fix the validation errors before submitting the form.
              </AlertDescription>
            </Alert>
          )}

          <ConfigurationSection
            title="Token Building Blocks"
            description="Configure one or more token blocks with their respective standards and properties"
            hasError={!!errors.blocks}
          >
            <div className="space-y-4">
              {formData.blocks.map((block, index) => (
                <TokenBlockForm
                  key={block.id}
                  block={block}
                  isFirstBlock={index === 0}
                  onBlockChange={(updatedBlock) => {
                    const newBlocks = [...formData.blocks];
                    newBlocks[index] = updatedBlock;
                    setValue("blocks", newBlocks, { shouldValidate: true });

                    if (index === 0) {
                      setValue("name", updatedBlock.name, {
                        shouldValidate: true,
                      });
                      setValue("symbol", updatedBlock.symbol, {
                        shouldValidate: true,
                      });
                      setValue("decimals", updatedBlock.decimals, {
                        shouldValidate: true,
                      });
                      setValue("standard", updatedBlock.standard, {
                        shouldValidate: true,
                      });
                      setValue("contractPreview", updatedBlock.contractPreview);
                    }
                  }}
                  hasErrors={!!errors.blocks?.[index]}
                  onBlockDelete={
                    index > 0
                      ? () => {
                          const newBlocks = formData.blocks.filter(
                            (_, i) => i !== index,
                          );
                          setValue("blocks", newBlocks, {
                            shouldValidate: true,
                          });
                        }
                      : undefined
                  }
                />
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  const newBlock: TokenBlock = {
                    id: `${formData.blocks.length}-${crypto.randomUUID()}`,
                    name: "",
                    symbol: "",
                    standard: formData.blocks[0]?.standard || "ERC20",
                    decimals: 18,
                    totalSupply: 0,
                    ratioToFirstBlock: 1,
                    metadata: {},
                  };
                  const newBlocks = [...formData.blocks, newBlock];
                  setValue("blocks", newBlocks, { shouldValidate: true });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Token Block
              </Button>
            </div>
          </ConfigurationSection>

          <ConfigurationSection
            title="Metadata Configuration"
            description="Configure additional properties for your token"
            hasError={!!errors.metadata}
          >
            <MetadataEditor
              standardType={formData.blocks[0]?.standard || "ERC20"}
              onFieldChange={handleMetadataChange}
            />
          </ConfigurationSection>

          <div className="flex justify-between gap-4">
            <div className="flex gap-2">
              <ImportButton
                onImport={(importedData) => {
                  reset(importedData);
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => reset(defaultValues)}
              >
                Reset
              </Button>
            </div>
            <Button type="submit" disabled={!isValid}>
              Save Configuration
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default TokenConfigurationForm;
