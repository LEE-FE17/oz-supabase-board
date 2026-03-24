import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function useEditPost(post, { onUpdated, onDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ title: post.title, contents: post.contents });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditStart = () => {
    setForm({ title: post.title, contents: post.contents });
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.contents.trim()) return;

    setSubmitting(true);
    setError(null);

    const { data, error } = await supabase
      .from("posts")
      .update({ title: form.title.trim(), contents: form.contents.trim() })
      .eq("id", post.id)
      .select()
      .single();

    if (error) {
      setError(error.message);
      setSubmitting(false);
    } else {
      setIsEditing(false);
      setSubmitting(false);
      onUpdated?.(data);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) {
      setError(error.message);
    } else {
      onDeleted?.();
    }
  };

  return {
    isEditing,
    form,
    handleChange,
    handleEditStart,
    handleEditCancel,
    handleUpdate,
    handleDelete,
    submitting,
    error,
  };
}

export default useEditPost;
