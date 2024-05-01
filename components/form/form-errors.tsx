import {  XCircle } from "lucide-react";

interface FormErrorsProps {
    errors?:Record<string,string[]|undefined>;
    id:string;
}

const FormErrors = (props:FormErrorsProps) => {

    const {errors,id} = props;

    if (!errors) {
        return null;
    }

  return (
    <div className="mt-2 text-sm text-rose-500" id={`${id}-error`} aria-live="polite">
        {
            errors?.[id]?.map((err)=>(
                <div key={err} className="flex items-center font-medium p-2 border border-rose-500 bg-rose-500/10 rounded-sm">
                    <XCircle className="h-4 w-4 mr-2" />
                    {err}
                </div>
            ))
        }
    </div>
  )
}

export default FormErrors