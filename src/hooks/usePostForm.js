import { useState } from "react";
import dayjs from "dayjs";
import { supabase } from "../lib/supabaseClient";

function usePostForm(onSuccess) {
  const [form, setForm] = useState({ title: "", contents: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.contents.trim()) return;

    setSubmitting(true);
    setError(null);

    const { error } = await supabase.from("posts").insert([
      {
        title: form.title.trim(),
        contents: form.contents.trim(),
        date: new Date().toISOString(),
      },
    ]);

    if (error) {
      setError(error.message);
      setSubmitting(false);
    } else {
      setForm({ title: "", contents: "" });
      onSuccess?.();
    }
  };

  return { form, handleChange, handleSubmit, submitting, error };
}

export default usePostForm;
